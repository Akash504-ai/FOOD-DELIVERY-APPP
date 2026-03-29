import api from "../utils/axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/api";
import { setItemsInMyCity } from "../redux/userSlice";

function useGetItemsByCity() {
  const dispatch = useDispatch();
  const { currentCity, userData } = useSelector((state) => state.user);

  useEffect(() => {
    // 🔥 IMPORTANT FIX
    const token = localStorage.getItem("token");
    if (!token || !userData || !currentCity) return;

    const fetchItems = async () => {
      try {
        const result = await api.get(
          `${BASE_URL}/api/item/get-by-city/${currentCity}`
        );

        dispatch(setItemsInMyCity(result.data));
      } catch (error) {
        console.log("GET ITEMS ERROR:", error?.response?.data);
      }
    };

    fetchItems();
  }, [currentCity, userData, dispatch]);
}

export default useGetItemsByCity;