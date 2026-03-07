import axios from "axios";
import Item from "../models/item.model.js";

export const recommendItems = async (req, res) => {
  try {

    const { itemId } = req.params;

    const response = await axios.get(
      `http://127.0.0.1:8000/recommend/${itemId}`
    );

    const ids = response.data.recommendations;

    const items = await Item.find({ _id: { $in: ids } });

    res.json({
      success: true,
      recommendations: items
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Recommendation error"
    });
  }
};