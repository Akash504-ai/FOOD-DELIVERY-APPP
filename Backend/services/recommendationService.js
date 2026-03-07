import axios from "axios";

export const getRecommendations = async (itemId) => {
  try {

    const response = await axios.get(
      `http://127.0.0.1:8000/recommend/${itemId}`
    );

    return response.data.recommendations;

  } catch (error) {
    console.error("Recommendation service error:", error.message);
    return [];
  }
};