import api from "../utils/axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/api";

function useUpdateLocation() {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    // ✅ only run if user exists
    if (!userData) return;

    const updateLocation = async (lat, lon) => {
      try {
        // ✅ validate before sending
        if (!lat || !lon) return;

        await api.post(
          `${BASE_URL}/api/user/update-location`,
          { lat, lon },
          { withCredentials: true }
        );
      } catch (error) {
        console.log("Location update error:", error);
      }
    };

    // ✅ check browser support
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // ✅ prevent invalid values (MAIN FIX)
        if (!lat || !lon) return;

        updateLocation(lat, lon);
      },
      (err) => {
        console.log("Location error:", err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
      }
    );

    // ✅ cleanup (VERY IMPORTANT)
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [userData]);
}

export default useUpdateLocation;