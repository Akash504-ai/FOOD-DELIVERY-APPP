import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  acceptOrder,
  getCurrentOrder,
  getDeliveryBoyAssignment,
  getMyOrders,
  getOrderById,
  getTodayDeliveries,
  placeOrder,
  sendDeliveryOtp,
  updateOrderStatus,
  verifyDeliveryOtp,
  verifyPayment,
  deleteOrder,
  verifyStripePayment
} from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/place-order", isAuth, placeOrder);

// ✅ Stripe verification (CRITICAL FIX)
orderRouter.post("/verify-stripe", verifyStripePayment);

// Razorpay (keep)
orderRouter.post("/verify-payment", verifyPayment);

orderRouter.get("/my-orders", isAuth, getMyOrders);
orderRouter.get("/get-assignments", isAuth, getDeliveryBoyAssignment);
orderRouter.get("/get-current-order", isAuth, getCurrentOrder);
orderRouter.post("/send-delivery-otp", isAuth, sendDeliveryOtp);
orderRouter.post("/verify-delivery-otp", isAuth, verifyDeliveryOtp);
orderRouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus);
orderRouter.get('/accept-order/:assignmentId', isAuth, acceptOrder);
orderRouter.get('/get-order-by-id/:orderId', isAuth, getOrderById);
orderRouter.get('/get-today-deliveries', isAuth, getTodayDeliveries);
orderRouter.delete("/delete/:orderId", isAuth, deleteOrder);

export default orderRouter;