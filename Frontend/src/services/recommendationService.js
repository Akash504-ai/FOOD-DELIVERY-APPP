import axios from "axios";

export const getRecommendations = async (itemId) => {
  const res = await axios.get(
    `https://food-delivery-appp-1.onrender.com/api/recommend/${itemId}`
  );

  return res.data.recommendations;
};