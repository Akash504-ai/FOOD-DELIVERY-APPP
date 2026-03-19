const BASE_URL = import.meta.env.VITE_API_URL;

export const getRecommendations = async (itemId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/recommend/${itemId}`
    );

    return response.data.recommendations;

  } catch (error) {
    console.error("Recommendation service error:", error.message);
    return [];
  }
};