import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          dispatch(setLocation({ lat: latitude, lon: longitude }));

          const result = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
          );

          const data = result?.data?.results?.[0];

          dispatch(setCurrentCity(data?.city || data?.county));
          dispatch(setCurrentState(data?.state));
          dispatch(
            setCurrentAddress(data?.address_line2 || data?.address_line1)
          );
          dispatch(setAddress(data?.address_line2));
        } catch (err) {
          console.log("Geo API error:", err);
        }
      },
      (error) => {
        console.log("Location permission denied:", error.message);
      }
    );
  }, [userData]);
}

export default useGetCity;