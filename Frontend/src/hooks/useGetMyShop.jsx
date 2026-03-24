import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/api";
import { setMyShopData } from "../redux/ownerSlice";

function useGetMyshop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return; // 🔥 important

    const fetchShop = async () => {
      try {
        const result = await axios.get(
          `${BASE_URL}/api/shop/get-my`,
          { withCredentials: true }
        );
        dispatch(setMyShopData(result.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchShop();
  }, [userData]);
}

export default useGetMyshop;