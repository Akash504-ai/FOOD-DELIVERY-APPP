import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

/* ================= CREATE / EDIT SHOP ================= */
export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    // ✅ 1. VALIDATION (prevents 400 confusion)
    if (!name || !city || !state || !address) {
      return res.status(400).json({
        message: "All fields (name, city, state, address) are required",
      });
    }

    let image;

    // ✅ 2. HANDLE IMAGE PROPERLY
    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);

      // ⚠️ IMPORTANT: save only URL
      image = uploaded?.url || uploaded;
    }

    // ✅ 3. CHECK EXISTING SHOP
    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      // ✅ CREATE NEW SHOP
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    } else {
      // ✅ UPDATE ONLY PROVIDED FIELDS
      const updateData = {
        name,
        city,
        state,
        address,
      };

      // 🔥 IMPORTANT FIX → only update image if new one exists
      if (image) {
        updateData.image = image;
      }

      shop = await Shop.findByIdAndUpdate(
        shop._id,
        updateData,
        { new: true }
      );
    }

    await shop.populate("owner items");

    return res.status(200).json(shop);

  } catch (error) {
    console.error("CREATE SHOP ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong while creating/updating shop",
    });
  }
};

/* ================= GET MY SHOP ================= */
export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId })
      .populate("owner")
      .populate({
        path: "items",
        options: { sort: { updatedAt: -1 } },
      });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    return res.status(200).json(shop);

  } catch (error) {
    console.error("GET MY SHOP ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch shop",
    });
  }
};

/* ================= GET SHOP BY CITY ================= */
export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    // ✅ return empty array instead of error
    return res.status(200).json(shops || []);

  } catch (error) {
    console.error("GET SHOP BY CITY ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch shops",
    });
  }
};