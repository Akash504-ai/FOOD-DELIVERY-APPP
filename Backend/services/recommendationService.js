const { getRecommendationsFromML } = require("../services/mlService");
const Food = require("../models/Food"); // adjust path if needed

const getRecommendations = async (req, res) => {
  try {
    const { itemId } = req.params;

    // 1. Get IDs from ML service
    const ids = await getRecommendationsFromML(itemId);

    if (!ids || ids.length === 0) {
      return res.json({ recommendations: [] });
    }

    // 2. Fetch full food data from DB
    const foods = await Food.find({ _id: { $in: ids } });

    // 3. OPTIONAL: maintain order (VERY IMPORTANT)
    const orderedFoods = ids.map(id =>
      foods.find(food => food._id.toString() === id)
    );

    res.json({ recommendations: orderedFoods });

  } catch (error) {
    console.error("Recommendation error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getRecommendations };