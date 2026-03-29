import api from "../utils/axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/api";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  FiPackage,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiTruck,
} from "react-icons/fi";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { socket } from "../socket";

function TrackOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [currentOrder, setCurrentOrder] = useState(null);
  const [liveLocations, setLiveLocations] = useState({});

  /* ================= API ================= */
  const handleGetOrder = async () => {
    try {
      const res = await api.get(
        `${BASE_URL}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true },
      );
      setCurrentOrder(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= INITIAL FETCH ================= */
  useEffect(() => {
    if (!orderId) return;
    handleGetOrder();
  }, [orderId]);

  /* ================= SOCKET ROOM ================= */
  useEffect(() => {
    if (!orderId) return;

    // join room for this order
    socket.emit("joinOrderRoom", orderId);

    return () => {
      socket.emit("leaveOrderRoom", orderId);
    };
  }, [orderId]);

  /* ================= SOCKET LISTENER ================= */
  useEffect(() => {
    if (!orderId) return;

    const handler = ({
      deliveryBoyId,
      latitude,
      longitude,
      orderId: incomingOrderId,
    }) => {
      // 🔴 filter only this order updates
      if (incomingOrderId !== orderId) return;

      setLiveLocations((prev) => ({
        ...prev,
        [deliveryBoyId]: { lat: latitude, lon: longitude },
      }));
    };

    socket.on("updateDeliveryLocation", handler);

    return () => {
      socket.off("updateDeliveryLocation", handler);
    };
  }, [orderId]);

  /* ================= POLLING (fallback only) ================= */
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(handleGetOrder, 30000); // slower

    return () => clearInterval(interval);
  }, [orderId]);

  /* ================= STEPPER ================= */
  const StatusStepper = ({ status, hasDeliveryBoy }) => {
    const normalizedStatus = status?.toLowerCase().replace(/\s+/g, "-");
    const steps = [
      { label: "Confirmed", icon: <FiCheckCircle />, active: true },
      {
        label: "Preparing",
        icon: <FiClock />,
        active: ["preparing", "out-for-delivery", "delivered"].includes(
          normalizedStatus,
        ),
      },
      {
        label: "On the way",
        icon: <FiTruck />,
        active:
          normalizedStatus === "out-for-delivery" ||
          normalizedStatus === "delivered" ||
          hasDeliveryBoy,
      },
      {
        label: "Delivered",
        icon: <FiPackage />,
        active: normalizedStatus === "delivered",
      },
    ];

    return (
      <div className="flex justify-between items-center mb-8 px-2">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center flex-1 relative">
            <div
              className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                step.active
                  ? "bg-[#ff4d2d] border-[#ff4d2d] text-white"
                  : "bg-white border-gray-200 text-gray-400"
              }`}
            >
              {step.icon}
            </div>

            <span
              className={`text-[10px] mt-2 font-bold uppercase tracking-tighter ${
                step.active ? "text-[#ff4d2d]" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>

            {i !== steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 ${
                  step.active ? "bg-[#ff4d2d]" : "bg-gray-100"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-4xl mx-auto p-5 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-orange-50 rounded-xl transition-all"
          >
            <IoIosArrowRoundBack size={32} />
          </button>

          <div>
            <h1 className="text-xl font-black">Live Tracking</h1>
            <p className="text-xs text-gray-500">
              Order ID: #{orderId?.slice(-6)}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 mt-6 space-y-10">
        {currentOrder?.shopOrders?.map((shopOrder, index) => {
          const deliveryBoy = shopOrder.assignedDeliveryBoy;

          // ✅ correct location priority
          const live = deliveryBoy ? liveLocations[deliveryBoy._id] : null;

          const fallback = deliveryBoy?.location
            ? {
                lat: deliveryBoy.location.coordinates[1],
                lon: deliveryBoy.location.coordinates[0],
              }
            : null;

          const finalLocation = live || fallback;

          const canShowMap = deliveryBoy && finalLocation;

          return (
            <div
              key={index}
              className="bg-white rounded-[2.5rem] shadow border overflow-hidden"
            >
              <div className="p-8 pb-0">
                <StatusStepper
                  status={shopOrder.status}
                  hasDeliveryBoy={!!deliveryBoy}
                />
              </div>

              <div className="p-8 space-y-6">
                {deliveryBoy && (
                  <div className="h-[450px] rounded-[2rem] overflow-hidden border">
                    {canShowMap && (
                      <DeliveryBoyTracking
                        data={{
                          deliveryBoyLocation: finalLocation,
                          customerLocation: {
                            lat: currentOrder.deliveryAddress.latitude,
                            lon: currentOrder.deliveryAddress.longitude,
                          },
                        }}
                      />
                    )}
                  </div>
                )}

                <div className="flex gap-4 p-5 bg-gray-50 rounded-2xl">
                  <FiMapPin className="text-[#ff4d2d] mt-1" />
                  <p className="font-bold">
                    {currentOrder.deliveryAddress?.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrackOrderPage;
