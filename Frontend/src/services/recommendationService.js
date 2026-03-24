import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getRecommendations = async (itemId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/recommend/${itemId}`
    );

    return res.data.recommendations;

  } catch (error) {
    console.error("Recommendation error:", error.message);
    return [];
  }
};