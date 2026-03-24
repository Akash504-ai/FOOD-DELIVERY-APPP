const axios = require("axios");

const ML_API = process.env.ML_API_URL;

const getRecommendationsFromML = async (itemId) => {
  try {
    const res = await axios.get(`${ML_API}/recommend/${itemId}`);
    return res.data.recommendations;
  } catch (err) {
    console.error("ML API error:", err.message);
    return [];
  }
};

module.exports = { getRecommendationsFromML };