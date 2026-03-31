import mongoose from "mongoose";
import axios from "axios";
import Item from "../models/item.model.js";

const ML_API = process.env.ML_API_URL;

export const recommendItems = async (req, res) => {
  try {
    const { itemId } = req.params;

    // ✅ Call ML API
    const response = await axios.get(
      `${ML_API}/recommend/${itemId}`
    );

    const ids = response.data.recommendations;

    // ✅ Fetch items from DB
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