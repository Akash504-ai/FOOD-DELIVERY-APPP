import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

/* ================= CREATE / EDIT SHOP ================= */
// export const createEditShop = async (req, res) => {
//   try {
//     const { name, city, state, address } = req.body;

//     // 🔍 DEBUG (remove later if needed)
//     console.log("BODY:", req.body);
//     console.log("FILE:", req.file);
//     console.log("USER ID:", req.userId);

//     // ✅ 1. VALIDATION
//     if (!name || !city || !state || !address) {
//       return res.status(400).json({
//         message: "All fields (name, city, state, address) are required",
//       });
//     }

//     let image = undefined;

//     // ✅ 2. SAFE IMAGE HANDLING (NO CRASH)
//     if (req.file && req.file.path) {
//       try {
//         const uploaded = await uploadOnCloudinary(req.file.path);
//         image = uploaded; // already a string URL
//         console.log("FILE PATH:", req.file?.path);
//         console.log("IMAGE URL:", image);
//       } catch (uploadError) {
//         console.error("CLOUDINARY ERROR:", uploadError);
//         // Continue without image instead of crashing
//       }
//     }

//     // ✅ 3. CHECK EXISTING SHOP
//     let shop = await Shop.findOne({ owner: req.userId });

//     if (!shop) {
//       // ✅ CREATE NEW SHOP
//       shop = await Shop.create({
//         name,
//         city,
//         state,
//         address,
//         image,
//         owner: req.userId,
//       });
//     } else {
//       // ✅ UPDATE SHOP
//       const updateData = {
//         name,
//         city,
//         state,
//         address,
//       };

//       // Only update image if new one uploaded
//       if (image) {
//         updateData.image = image;
//       }

//       shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
//     }

//     await shop.populate("owner items");

//     return res.status(200).json(shop);
//   } catch (error) {
//     console.error("CREATE SHOP ERROR:", error);

//     return res.status(500).json({
//       message: "Something went wrong while creating/updating shop",
//       error: error.message, // 🔥 helps debugging
//     });
//   }
// };
export const createEditShop = async (req, res) => {
  try {
    console.log("🔥 HIT CREATE SHOP");

    const { name, city, state, address } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.userId);

    let image;

    // 🚨 TEMP: SKIP CLOUDINARY COMPLETELY
    if (req.file) {
      console.log("FILE PATH:", req.file.path);
      image = "test-image-url"; // 🔥 FORCE SUCCESS
    }

    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    } else {
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        { name, city, state, address, image },
        { new: true }
      );
    }

    return res.status(200).json(shop);

  } catch (error) {
    console.error("🔥 FINAL ERROR:", error);

    return res.status(500).json({
      message: "ERROR",
      error: error.message,
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
      error: error.message,
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

    return res.status(200).json(shops || []);
  } catch (error) {
    console.error("GET SHOP BY CITY ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch shops",
      error: error.message,
    });
  }
};
