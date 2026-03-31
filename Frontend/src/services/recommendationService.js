import api from "../utils/axios";

export const getRecommendations = async (itemId) => {
  try {
    const res = await api.get(`/api/recommend/${itemId}`);
    return res.data.recommendations || [];
  } catch (error) {
    console.error("Recommendation error:", error.message);
    return [];
  }
};