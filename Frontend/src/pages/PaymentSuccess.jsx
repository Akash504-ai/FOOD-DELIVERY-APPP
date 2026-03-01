import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function PaymentSuccess() {
  const navigate = useNavigate();

  // Animation Variants
  const containerVars = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const drawCheck = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1, transition: { duration: 0.8, ease: "easeInOut", delay: 0.2 } },
  };

  return (
    <motion.div 
      variants={containerVars}
      initial="initial"
      animate="animate"
      className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4"
    >
      {/* Animated Success Icon */}
      <div className="relative mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
        >
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <motion.path
              variants={drawCheck}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
        
        {/* Decorative Circles */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border-2 border-green-200 rounded-full"
        />
      </div>

      <motion.h1 
        variants={itemVars}
        className="text-4xl font-extrabold text-slate-800 mb-2"
      >
        Payment Received!
      </motion.h1>

      <motion.p 
        variants={itemVars}
        className="text-slate-500 mb-8 text-center max-w-sm"
      >
        Your transaction was completed successfully. Your order details have been sent to your email.
      </motion.p>

      <motion.button
        variants={itemVars}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 transition-colors"
        onClick={() => navigate("/order-placed")}
      >
        Continue to Order
      </motion.button>
    </motion.div>
  );
}

export default PaymentSuccess;