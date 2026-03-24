import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/api";

function useUpdateLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    const updateLocation = async (lat, lon) => {
      try {
        await axios.post(
          `${BASE_URL}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true }
        );
      } catch (error) {
        console.log("Location update error:", error);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        updateLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.log("Location error:", err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
      }
    );

    // 🔥 CLEANUP (VERY IMPORTANT)
    return () => navigator.geolocation.clearWatch(watchId);
  }, [userData]);
}

export default useUpdateLocation;