import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/axios";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const verify = async () => {
      try {
        const session_id = searchParams.get("session_id");
        const orderId = searchParams.get("orderId");

        if (!session_id || !orderId) return;

        await api.post("/api/order/verify-stripe", {
          session_id,
          orderId,
        });

      } catch (err) {
        console.log("VERIFY ERROR:", err);
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-green-600">
        Payment Successful
      </h1>

      <button
        onClick={() => navigate("/order-placed")}
        className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-xl"
      >
        Continue
      </button>
    </div>
  );
}

export default PaymentSuccess;