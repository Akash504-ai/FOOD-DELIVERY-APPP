import axios from "axios";
import Item from "../models/item.model.js";
import Order from "../models/order.model.js";

const ML_API = process.env.ML_API_URL;

export const recommendItems = async (req, res) => {
  try {
    const { itemId } = req.params;

    // ✅ STEP 1: CHECK USER ORDERS
    const userOrders = await Order.find({ user: req.userId });

    if (!userOrders.length) {
      return res.json({
        success: true,
        recommendations: [], // ❌ no recommendations
      });
    }

    // ✅ STEP 2: CALL ML (only if user has history)
    const response = await axios.get(
      `${ML_API}/recommend/${itemId}`
    );

    const ids = response.data.recommendations;

    // ✅ STEP 3: FETCH ITEMS
    const items = await Item.find({
      _id: { $in: ids }
    });

    res.json({
      success: true,
      recommendations: items
    });

  } catch (error) {
    console.error("Recommendation error:", error.message);

    res.status(500).json({
      success: false,
      message: "Recommendation error"
    });
  }
};