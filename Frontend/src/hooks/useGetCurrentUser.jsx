import api from "../utils/axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/api";
import { setUserData, setLoading } from "../redux/userSlice";

function useGetCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const res = await api.get(
          `${BASE_URL}/api/user/current`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        dispatch(setUserData(res.data));
      } catch (error) {
        dispatch(setUserData(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);
}

export default useGetCurrentUser;