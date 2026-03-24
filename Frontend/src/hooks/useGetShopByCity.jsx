import api from "../utils/axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/api";
import { setShopsInMyCity } from "../redux/userSlice";

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentCity) return; // 🔥 important

    const fetchShops = async () => {
      try {
        const result = await api.get(
          `${BASE_URL}/api/shop/get-by-city/${currentCity}`,
          { withCredentials: true }
        );
        dispatch(setShopsInMyCity(result.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchShops();
  }, [currentCity]);
}

export default useGetShopByCity;