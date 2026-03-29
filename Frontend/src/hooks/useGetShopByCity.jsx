import api from "../utils/axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/api";
import { setShopsInMyCity } from "../redux/userSlice";

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { currentCity, userData } = useSelector((state) => state.user);

  useEffect(() => {
    // 🔥 IMPORTANT FIX
    const token = localStorage.getItem("token");
    if (!token || !userData || !currentCity) return;

    const fetchShops = async () => {
      try {
        const result = await api.get(
          `${BASE_URL}/api/shop/get-by-city/${currentCity}`
        );

        dispatch(setShopsInMyCity(result.data));
      } catch (error) {
        console.log("GET SHOPS ERROR:", error?.response?.data);
      }
    };

    fetchShops();
  }, [currentCity, userData, dispatch]);
}

export default useGetShopByCity;