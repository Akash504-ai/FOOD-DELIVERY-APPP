import React from 'react';
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function OrderPlaced() {
    const navigate = useNavigate();

    return (
        <div className='min-h-screen bg-[#fcfcfc] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden'>
            
            {/* Background Decorative Blobs */}
            <div className='absolute top-[-10%] left-[-10%] w-72 h-72 bg-green-100 rounded-full blur-[100px] opacity-60 animate-pulse' />
            <div className='absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-60' />

            {/* Success Content Card */}
            <div className='max-w-lg w-full bg-white/70 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white z-10'>
                
                {/* Animated Icon Container */}
                <div className='inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-full mb-8 relative'>
                    <div className='absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20' />
                    <FaCheckCircle className='text-green-500 text-6xl relative z-10' />
                </div>

                <h1 className='text-4xl font-black text-gray-900 mb-4 tracking-tight'>
                    Order <span className='text-green-500'>Successful!</span>
                </h1>

                <p className='text-gray-500 text-lg leading-relaxed mb-10 font-medium'>
                    Thank you for choosing us! Your delicious order is now being prepared with care. 
                    You can track the live progress in your dashboard.
                </p>

                <div className='flex flex-col gap-4'>
                    <button 
                        className='group w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-[0_15px_30px_rgba(255,77,45,0.3)] hover:shadow-[0_15px_40px_rgba(255,77,45,0.4)] transition-all duration-300 flex items-center justify-center gap-2 hover:translate-y-[-2px]' 
                        onClick={() => navigate("/my-orders")}
                    >
                        Track My Order
                        <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
                    </button>

                    <button 
                        className='w-full text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors py-2'
                        onClick={() => navigate("/")}
                    >
                        Back to Home
                    </button>
                </div>
            </div>

            {/* Bottom Tagline */}
            <p className='mt-8 text-gray-400 text-xs font-bold uppercase tracking-[0.2em] z-10'>
                Delivering Happiness to your doorstep
            </p>
        </div>
    );
}

export default OrderPlaced;