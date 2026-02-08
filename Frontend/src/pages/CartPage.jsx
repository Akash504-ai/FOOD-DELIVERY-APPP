import React from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';

function CartPage() {
    const navigate = useNavigate();
    const { cartItems, totalAmount } = useSelector(state => state.user);

    return (
        <div className='min-h-screen bg-[#fffcfb] pb-20'>
            {/* --- TOP NAVIGATION --- */}
            <div className='w-full bg-white/80 backdrop-blur-md sticky top-0 z-[50] border-b border-gray-100'>
                <div className='max-w-7xl mx-auto px-6 h-[80px] flex items-center gap-4'>
                    <button 
                        onClick={() => navigate("/")}
                        className='p-2 hover:bg-gray-100 rounded-xl transition-colors text-[#ff4d2d]'
                    >
                        <IoIosArrowRoundBack size={35} />
                    </button>
                    <h1 className='text-2xl font-black text-gray-800 tracking-tighter'>
                        Your <span className='text-[#ff4d2d]'>Cart</span>
                    </h1>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-6 mt-10'>
                {cartItems?.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-32'>
                        <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-gray-200'>
                            <FiShoppingBag size={40} className='text-gray-300' />
                        </div>
                        <h2 className='text-2xl font-black text-gray-400 uppercase tracking-widest'>Your cart is empty</h2>
                        <button 
                            onClick={() => navigate("/")}
                            className='mt-6 px-8 py-3 bg-[#ff4d2d] text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:scale-105 transition-all'
                        >
                            Start Ordering
                        </button>
                    </div>
                ) : (
                    <div className='flex flex-col lg:flex-row gap-10 items-start'>
                        
                        {/* --- LEFT: CART ITEMS LIST --- */}
                        <div className='w-full lg:w-2/3 space-y-4'>
                            <div className='flex items-center gap-2 mb-4 px-2'>
                                <span className='text-xs font-black uppercase tracking-widest text-gray-400'>
                                    Items ({cartItems.length})
                                </span>
                            </div>
                            <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
                                {cartItems?.map((item, index) => (
                                    <CartItemCard data={item} key={index} />
                                ))}
                            </div>
                        </div>

                        {/* --- RIGHT: ORDER SUMMARY --- */}
                        <div className='w-full lg:w-1/3 sticky top-[100px]'>
                            <div className='bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 border border-gray-100'>
                                <h2 className='text-xl font-black text-gray-800 mb-6 tracking-tight'>Order Summary</h2>
                                
                                <div className='space-y-4'>
                                    <div className='flex justify-between text-gray-500 font-medium'>
                                        <span>Subtotal</span>
                                        <span>₹{totalAmount}</span>
                                    </div>
                                    <div className='flex justify-between text-gray-500 font-medium'>
                                        <span>Delivery Fee</span>
                                        <span className='text-emerald-500 font-bold'>FREE</span>
                                    </div>
                                    <div className='flex justify-between text-gray-500 font-medium'>
                                        <span>Extra Taxes</span>
                                        <span>₹0</span>
                                    </div>
                                    
                                    <div className='h-[1px] bg-gray-100 my-2' />
                                    
                                    <div className='flex justify-between items-center'>
                                        <span className='text-lg font-bold text-gray-800'>Total Amount</span>
                                        <div className='flex flex-col items-end'>
                                            <span className='text-3xl font-black text-[#ff4d2d]'>₹{totalAmount}</span>
                                            <span className='text-[10px] text-gray-400 font-bold uppercase tracking-wider'>Inc. all taxes</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    className='w-full mt-8 bg-[#ff4d2d] text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group'
                                    onClick={() => navigate("/checkout")}
                                >
                                    Proceed to Checkout
                                    <FiArrowRight size={20} className='group-hover:translate-x-1 transition-transform' />
                                </button>
                                
                                <p className='text-center text-gray-400 text-[10px] mt-6 font-bold uppercase tracking-widest'>
                                    Secure SSL Encrypted Checkout
                                </p>
                            </div>
                            
                            {/* Extra Promo/Safety Card */}
                            <div className='mt-6 px-8 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3'>
                                <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                                <p className='text-xs font-bold text-emerald-700'>
                                    Safe and contactless delivery guaranteed.
                                </p>
                            </div>
                        </div>
                        
                    </div>
                )}
            </div>
        </div>
    );
}

export default CartPage;