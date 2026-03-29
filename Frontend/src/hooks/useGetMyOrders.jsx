import api from "../utils/axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/api";
import { setMyOrders } from "../redux/userSlice";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    // 🔥 IMPORTANT FIX
    const token = localStorage.getItem("token");
    if (!token || !userData) return;

    const fetchOrders = async () => {
      try {
        const result = await api.get(
          `${BASE_URL}/api/order/my-orders`
        );

        dispatch(setMyOrders(result.data));
      } catch (error) {
        console.log("GET ORDERS ERROR:", error?.response?.data);
      }
    };

    fetchOrders();
  }, [userData, dispatch]);
}

export default useGetMyOrders;