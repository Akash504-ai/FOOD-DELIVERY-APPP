import React from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { useEffect } from "react";
import { useState } from "react";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import { ClipLoader } from "react-spinners";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { socket } from "../socket.js";

function DeliveryBoy() {
  // const { socket } = useSelector((state) => state.user);
  const { userData } = useSelector((state) => state.user);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [otp, setOtp] = useState("");
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!userData || userData.role !== "deliveryBoy") return;

    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setDeliveryBoyLocation({ lat: latitude, lon: longitude });

          socket.emit("updateLocation", {
            latitude,
            longitude,
            userId: userData._id,
          });
        },
        (error) => console.log(error),
        { enableHighAccuracy: true },
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [userData?._id]);

  const ratePerDelivery = 50;
  const totalEarning = todayDeliveries.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0,
  );

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });

      setAvailableAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        { withCredentials: true },
      );
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptOrder = async (assignmentId) => {
  try {
    await axios.get(
      `${serverUrl}/api/order/accept-order/${assignmentId}`,
      { withCredentials: true }
    );

    setAvailableAssignments(prev =>
      prev.filter(a => a.assignmentId !== assignmentId)
    );

    getCurrentOrder();
  } catch (error) {
    console.log(error);
  }
};



  useEffect(() => {
    if (!userData || userData.role !== "deliveryBoy") return;

    const handler = (data) => {
      setAvailableAssignments(prev => {
  if (!prev) return [data];
  if (prev.find(a => a.assignmentId === data.assignmentId)) return prev;
  return [...prev, data];
});

    };

    socket.on("newAssignment", handler);

    return () => {
      socket.off("newAssignment", handler);
    };
  }, [userData?._id]);

  const sendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
        },
        { withCredentials: true },
      );
      setLoading(false);
      setShowOtpBox(true);
      console.log(result.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const verifyOtp = async () => {
    setMessage("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        { withCredentials: true },
      );
      console.log(result.data);
      setMessage(result.data.message);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-today-deliveries`,
        { withCredentials: true },
      );
      console.log(result.data);
      setTodayDeliveries(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAssignments();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData]);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-[#fcfcfc] overflow-y-auto pb-12">
      <Nav />

      <div className="w-full max-w-[850px] flex flex-col gap-8 items-center pt-24 px-4">
        {/* Welcome Card & Real-time Location */}
        <div className="w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Welcome back,{" "}
              <span className="text-[#ff4d2d]">{userData.fullName}</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Ready for your next delivery mission?
            </p>
          </div>
          <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100">
            <p className="text-[#ff4d2d] text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-[#ff4d2d] rounded-full animate-pulse" />
              GPS: {deliveryBoyLocation?.lat.toFixed(4)},{" "}
              {deliveryBoyLocation?.lon.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Analytics & Earnings Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              📊 Today's Activity
            </h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={todayDeliveries}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(h) => `${h}:00`}
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: "12px", fill: "#999" }}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: "#fff5f3" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                    labelFormatter={(label) => `Time: ${label}:00`}
                  />
                  <Bar
                    dataKey="count"
                    fill="#ff4d2d"
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#ff4d2d] to-[#ff785d] rounded-[2rem] p-8 shadow-lg shadow-orange-100 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full" />
            <h2 className="text-lg font-bold opacity-90 mb-2 uppercase tracking-widest">
              Today's Earnings
            </h2>
            <span className="text-5xl font-black drop-shadow-md">
              ₹{totalEarning}
            </span>
            <div className="mt-4 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold">
              Settlement in progress
            </div>
          </div>
        </div>

        {/* Available Orders Section */}
        {!currentOrder?.shopOrder && (
          <div className="w-full bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
                🛰️ Nearby Tasks
              </h1>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full animate-pulse">
                Live Updates
              </span>
            </div>

            <div className="space-y-4">
              {availableAssignments?.length > 0 ? (
                availableAssignments.map((a, index) => (
                  <div
                    className="group bg-gray-50 hover:bg-white border border-transparent hover:border-orange-100 rounded-[1.5rem] p-5 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all duration-300 hover:shadow-xl"
                    key={index}
                  >
                    <div className="flex-1">
                      <p className="text-lg font-black text-gray-800">
                        {a?.shopName}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 font-medium">
                        📍 {a?.deliveryAddress.text}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs bg-white px-2 py-1 rounded-md border border-gray-200 font-bold text-gray-400">
                          {a.items.length} ITEMS
                        </span>
                        <span className="text-sm font-black text-[#ff4d2d]">
                          ₹{a.subtotal}
                        </span>
                      </div>
                    </div>
                    <button
                      className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-[#ff4d2d] transition-all active:scale-95"
                      onClick={() => acceptOrder(a.assignmentId)}
                    >
                      Accept Task
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400 font-bold">
                    Waiting for new orders in your zone...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Order Section */}
        {currentOrder?.shopOrder && (
          <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-2xl border-t-4 border-[#ff4d2d] animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                📦 Active Task
              </h2>
              <span className="bg-orange-100 text-[#ff4d2d] px-3 py-1 rounded-lg text-xs font-black">
                IN PROGRESS
              </span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
              <p className="font-black text-lg text-gray-800 mb-1">
                {currentOrder?.shopOrder.shop.name}
              </p>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {currentOrder.deliveryAddress.text}
              </p>
              <div className="h-[1px] bg-gray-200 my-4" />
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Order Details: {currentOrder.shopOrder.shopOrderItems.length}{" "}
                items • ₹{currentOrder.shopOrder.subtotal}
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-inner border border-gray-100">
              <DeliveryBoyTracking
                data={{
                  deliveryBoyLocation: deliveryBoyLocation || {
                    lat: userData.location.coordinates[1],
                    lon: userData.location.coordinates[0],
                  },
                  customerLocation: {
                    lat: currentOrder.deliveryAddress.latitude,
                    lon: currentOrder.deliveryAddress.longitude,
                  },
                }}
              />
            </div>

            {!showOtpBox ? (
              <button
                className="mt-8 w-full bg-[#22c55e] text-white font-black py-5 px-4 rounded-[1.5rem] shadow-xl shadow-green-100 hover:bg-[#16a34a] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader size={24} color="white" />
                ) : (
                  "MARK AS DELIVERED"
                )}
              </button>
            ) : (
              <div className="mt-8 p-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 animate-in fade-in zoom-in duration-300">
                <p className="text-center text-gray-600 font-bold mb-6">
                  Please enter the OTP provided by <br />
                  <span className="text-[#ff4d2d] text-lg font-black">
                    {currentOrder.user.fullName}
                  </span>
                </p>

                <div className="max-w-xs mx-auto">
                  <input
                    type="text"
                    className="w-full bg-white border-2 border-gray-100 px-4 py-4 rounded-2xl mb-4 text-center text-3xl font-black tracking-[10px] focus:border-[#ff4d2d] focus:outline-none transition-all"
                    placeholder="0000"
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                  />

                  {message && (
                    <p className="text-center text-green-500 font-black text-xl mb-4 animate-bounce">
                      {message}
                    </p>
                  )}

                  <button
                    className="w-full bg-[#ff4d2d] text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-200 hover:bg-[#e64429] transition-all"
                    onClick={verifyOtp}
                  >
                    VERIFY & COMPLETE
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryBoy;
