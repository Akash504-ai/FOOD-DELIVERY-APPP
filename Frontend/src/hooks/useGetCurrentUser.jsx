import api from "../utils/axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData, setLoading } from "../redux/userSlice";

function useGetCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));

      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(setUserData(null));
        dispatch(setLoading(false));
        return;
      }

      try {
        const res = await api.get("/api/user/current");
        dispatch(setUserData(res.data.user || res.data));
      } catch (error) {
        console.log("USER FETCH ERROR:", error?.response?.status);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);
}

export default useGetCurrentUser;