import axios from "axios";

export const getRecommendations = async (itemId) => {
  const res = await axios.get(
    `http://localhost:5000/api/recommend/${itemId}`
  );

  return res.data.recommendations;
};