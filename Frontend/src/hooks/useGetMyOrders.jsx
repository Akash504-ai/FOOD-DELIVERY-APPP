import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/api";
import { setMyOrders } from "../redux/userSlice";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return; // 🔥 important

    const fetchOrders = async () => {
      try {
        const result = await axios.get(
          `${BASE_URL}/api/order/my-orders`,
          { withCredentials: true }
        );
        dispatch(setMyOrders(result.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, [userData]);
}

export default useGetMyOrders;