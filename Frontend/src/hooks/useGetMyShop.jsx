import api from "../utils/axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/api";
import { setMyShopData } from "../redux/ownerSlice";

function useGetMyshop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    // 🔥 IMPORTANT FIX
    const token = localStorage.getItem("token");
    if (!token || !userData) return;

    const fetchShop = async () => {
      try {
        const result = await api.get(
          `${BASE_URL}/api/shop/get-my`
        );

        dispatch(setMyShopData(result.data));
      } catch (error) {
        console.log("GET MY SHOP ERROR:", error?.response?.data);
      }
    };

    fetchShop();
  }, [userData, dispatch]);
}

export default useGetMyshop;