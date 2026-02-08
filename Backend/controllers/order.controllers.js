import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
import RazorPay from "razorpay";
import dotenv from "dotenv";
import { count } from "console";

dotenv.config();
let instance = new RazorPay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "cart is empty" });
    }

    const groupItemsByShop = {};

    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) groupItemsByShop[shopId] = [];
      groupItemsByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        const items = groupItemsByShop[shopId];
        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItems: items.map((i) => ({
            item: i.id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      })
    );

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    await newOrder.populate("shopOrders.owner", "socketId");

    const io = req.app.get("io");

    if (io) {
      newOrder.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrderIncoming", {
            orderId: newOrder._id,
            shopId: shopOrder.shop,
            createdAt: newOrder.createdAt,
          });
        }
      });
    }

    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ message: `place order error ${error}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, orderId } = req.body;

    const payment = await instance.payments.fetch(razorpay_payment_id);
    if (!payment || payment.status !== "captured") {
      return res.status(400).json({ message: "payment not captured" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }

    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await order.populate("shopOrders.owner", "socketId");

    const io = req.app.get("io");

    if (io) {
      order.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrderIncoming", {
            orderId: order._id,
            shopId: shopOrder.shop, // 🔥 frontend depends on this
            createdAt: order.createdAt,
          });
        }
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({
      message: `verify payment error ${error}`,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role == "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      return res.status(200).json(orders);
    } else if (user.role == "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("shopOrders.assignedDeliveryBoy", "fullName mobile");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: order.shopOrders.find((o) => o.owner._id == req.userId),
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
        payment: order.payment,
      }));

      return res.status(200).json(filteredOrders);
    }
  } catch (error) {
    return res.status(500).json({ message: `get User order error ${error}` });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);

    const shopOrder = order.shopOrders.find((o) => o.shop == shopId);
    if (!shopOrder) {
      return res.status(400).json({ message: "shop order not found" });
    }
    shopOrder.status = status;
    let deliveryBoysPayload = [];
    if (status == "out of delivery" && !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 5000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["brodcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((id) => String(id)));

      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id)),
      );
      const candidates = availableBoys.map((b) => b._id);

      if (candidates.length == 0) {
        await order.save();
        return res.json({
          message:
            "order status updated but there is no available delivery boys",
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order?._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder?._id,
        brodcastedTo: candidates,
        status: "brodcasted",
      });

      shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;
      shopOrder.assignment = deliveryAssignment._id;
      deliveryBoysPayload = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));

      await deliveryAssignment.populate("order");
      await deliveryAssignment.populate("shop");
      const io = req.app.get("io");
      if (io) {
        availableBoys.forEach((boy) => {
          const boySocketId = boy.socketId;
          if (boySocketId) {
            io.to(boySocketId).emit("newAssignment", {
              sentTo: boy._id,
              assignmentId: deliveryAssignment._id,
              orderId: deliveryAssignment.order._id,
              shopName: deliveryAssignment.shop.name,
              deliveryAddress: deliveryAssignment.order.deliveryAddress,
              items:
                deliveryAssignment.order.shopOrders.find((so) =>
                  so._id.equals(deliveryAssignment.shopOrderId),
                ).shopOrderItems || [],
              subtotal: deliveryAssignment.order.shopOrders.find((so) =>
                so._id.equals(deliveryAssignment.shopOrderId),
              )?.subtotal,
            });
          }
        });
      }
    }

    await order.save();
    const updatedShopOrder = order.shopOrders.find((o) => o.shop == shopId);
    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobile",
    );
    await order.populate("user", "socketId");

    const io = req.app.get("io");
    if (io) {
      const userSocketId = order.user.socketId;
      if (userSocketId) {
        io.to(userSocketId).emit("update-status", {
          orderId: order._id,
          shopId: updatedShopOrder.shop._id,
          status: updatedShopOrder.status,
          userId: order.user._id,
        });
      }
    }

    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoysPayload,
      assignment: updatedShopOrder?.assignment?._id,
    });
  } catch (error) {
    return res.status(500).json({ message: `order status error ${error}` });
  }
};

export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const assignments = await DeliveryAssignment.find({
      brodcastedTo: deliveryBoyId,
      status: "brodcasted",
    })
      .populate("order")
      .populate("shop");

    const formated = assignments.map((a) => ({
      assignmentId: a._id,
      orderId: a.order._id,
      shopName: a.shop.name,
      deliveryAddress: a.order.deliveryAddress,
      items:
        a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
          .shopOrderItems || [],
      subtotal: a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
        ?.subtotal,
    }));

    return res.status(200).json(formated);
  } catch (error) {
    return res.status(500).json({ message: `get Assignment error ${error}` });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const deliveryBoyId = req.userId;

    // 1️⃣ Find assignment
    const assignment = await DeliveryAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(400).json({ message: "Assignment not found" });
    }

    // 2️⃣ Check assignment status
    if (assignment.status !== "brodcasted") {
      return res.status(400).json({ message: "Assignment already expired" });
    }

    // 3️⃣ Check if delivery boy already has an active order
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $in: ["assigned"] },
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        message: "You are already assigned to another order",
      });
    }

    // 4️⃣ Atomically assign the order (prevents race condition)
    const updatedAssignment = await DeliveryAssignment.findOneAndUpdate(
      {
        _id: assignmentId,
        status: "brodcasted",
      },
      {
        assignedTo: deliveryBoyId,
        status: "assigned",
        acceptedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(400).json({
        message: "Assignment already taken by another delivery boy",
      });
    }

    // 5️⃣ Update Order.shopOrders
    const order = await Order.findById(updatedAssignment.order)
      .populate("user", "socketId")
      .populate("shopOrders.owner", "socketId");

    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.id(updatedAssignment.shopOrderId);
    if (!shopOrder) {
      return res.status(400).json({ message: "Shop order not found" });
    }

    shopOrder.assignedDeliveryBoy = deliveryBoyId;
    await order.save();

    // 6️⃣ Emit socket events (user + shop owner)
    const io = req.app.get("io");
    if (io) {
      // Notify user
      if (order.user?.socketId) {
        io.to(order.user.socketId).emit("delivery-assigned", {
          orderId: order._id,
          shopId: shopOrder.shop,
          deliveryBoyId,
        });
      }

      // Notify shop owner
      if (shopOrder.owner?.socketId) {
        io.to(shopOrder.owner.socketId).emit("delivery-assigned", {
          orderId: order._id,
          shopId: shopOrder.shop,
          deliveryBoyId,
        });
      }
    }

    // 7️⃣ Success response
    return res.status(200).json({
      message: "Order accepted successfully",
      assignmentId: updatedAssignment._id,
      orderId: order._id,
      shopOrderId: shopOrder._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: `accept order error: ${error.message}`,
    });
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "assigned",
    })
      .populate("shop", "name")
      .populate("assignedTo", "fullName email mobile location")
      .populate({
        path: "order",
        populate: [{ path: "user", select: "fullName email location mobile" }],
      });

    if (!assignment) {
      return res.status(200).json(null);
    }

    if (!assignment.order) {
      return res.status(400).json({ message: "order not found" });
    }

    const shopOrder = assignment.order.shopOrders.find(
      (so) => String(so._id) == String(assignment.shopOrderId),
    );

    if (!shopOrder) {
      return res.status(400).json({ message: "shopOrder not found" });
    }

    let deliveryBoyLocation = { lat: null, lon: null };
    if (assignment.assignedTo.location.coordinates.length == 2) {
      deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0];
    }

    let customerLocation = { lat: null, lon: null };
    if (assignment.order.deliveryAddress) {
      customerLocation.lat = assignment.order.deliveryAddress.latitude;
      customerLocation.lon = assignment.order.deliveryAddress.longitude;
    }

    return res.status(200).json({
      _id: assignment.order._id,
      user: assignment.order.user,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation,
    });
  } catch (error) {
    return res.status(500).json({
      message: `get current order error ${error.message}`,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({
        path: "shopOrders.shop",
        model: "Shop",
      })
      .populate({
        path: "shopOrders.assignedDeliveryBoy",
        model: "User",
      })
      .populate({
        path: "shopOrders.shopOrderItems.item",
        model: "Item",
      })
      .lean();

    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: `get by id order error ${error}` });
  }
};

export const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;
    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!order || !shopOrder) {
      return res.status(400).json({ message: "enter valid order/shopOrderid" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = Date.now() + 5 * 60 * 1000;
    await order.save();
    await sendDeliveryOtpMail(order.user, otp);
    return res
      .status(200)
      .json({ message: `Otp sent Successfuly to ${order?.user?.fullName}` });
  } catch (error) {
    return res.status(500).json({ message: `delivery otp error ${error}` });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;

    // 1️⃣ Basic validation
    if (!orderId || !shopOrderId || !otp) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2️⃣ Fetch order
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    // 3️⃣ Fetch shopOrder safely
    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!shopOrder) {
      return res.status(400).json({ message: "Shop order not found" });
    }

    // 4️⃣ OTP validation (🔥 THIS WAS THE MAIN BUG)
    const savedOtp = String(shopOrder.deliveryOtp || "").trim();
    const userOtp = String(otp).trim();

    if (
      !savedOtp ||
      savedOtp !== userOtp ||
      !shopOrder.otpExpires ||
      shopOrder.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 5️⃣ Mark delivered
    shopOrder.status = "delivered";
    shopOrder.deliveredAt = new Date();

    // 6️⃣ Clear OTP (IMPORTANT)
    shopOrder.deliveryOtp = null;
    shopOrder.otpExpires = null;

    await order.save();

    // 7️⃣ Remove delivery assignment
    await DeliveryAssignment.deleteOne({
      order: order._id,
      shopOrderId: shopOrder._id,
      assignedTo: shopOrder.assignedDeliveryBoy,
    });

    return res.status(200).json({
      message: "Order Delivered Successfully!",
    });
  } catch (error) {
    console.error("verifyDeliveryOtp error:", error);
    return res.status(500).json({
      message: "Internal server error while verifying OTP",
    });
  }
};

export const getTodayDeliveries = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const startsOfDay = new Date();
    startsOfDay.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      "shopOrders.assignedDeliveryBoy": deliveryBoyId,
      "shopOrders.status": "delivered",
      "shopOrders.deliveredAt": { $gte: startsOfDay },
    }).lean();

    let todaysDeliveries = [];

    orders.forEach((order) => {
      order.shopOrders.forEach((shopOrder) => {
        if (
          shopOrder.assignedDeliveryBoy == deliveryBoyId &&
          shopOrder.status == "delivered" &&
          shopOrder.deliveredAt &&
          shopOrder.deliveredAt >= startsOfDay
        ) {
          todaysDeliveries.push(shopOrder);
        }
      });
    });

    let stats = {};

    todaysDeliveries.forEach((shopOrder) => {
      const hour = new Date(shopOrder.deliveredAt).getHours();
      stats[hour] = (stats[hour] || 0) + 1;
    });

    let formattedStats = Object.keys(stats).map((hour) => ({
      hour: parseInt(hour),
      count: stats[hour],
    }));

    formattedStats.sort((a, b) => a.hour - b.hour);

    return res.status(200).json(formattedStats);
  } catch (error) {
    return res.status(500).json({ message: `today deliveries error ${error}` });
  }
};
