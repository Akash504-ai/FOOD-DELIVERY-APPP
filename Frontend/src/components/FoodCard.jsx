import React, { useState } from 'react'
import { FaLeaf, FaDrumstickBite, FaStar, FaPlus, FaMinus, FaCheck } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';

function FoodCard({ data }) {
    const [quantity, setQuantity] = useState(1); 
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.user);
    const isAdded = cartItems.some(i => i.id === data._id);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar key={i} className={`${i <= rating ? 'text-orange-400' : 'text-gray-200'} text-[10px]`} />
            );
        }
        return stars;
    };

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => quantity > 1 && setQuantity(prev => prev - 1);

    const handleAddToCart = () => {
        dispatch(addToCart({
            id: data._id,
            name: data.name,
            price: data.price,
            image: data.image,
            shop: data.shop,
            quantity,
            foodType: data.foodType
        }));
    };

    return (
        /* STEP 2: Main Card - Solid white, border-gray-300, and controlled shadow */
        <div className='group w-full max-w-[280px] bg-white rounded-[2.2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 border border-gray-300 relative'>
            
            {/* Image Container */}
            <div className='relative w-full h-[190px] overflow-hidden'>
                {/* Veg/Non-Veg Badge with gray-300 border */}
                <div className='absolute top-4 left-4 z-10 bg-white p-1.5 rounded-xl shadow-sm border border-gray-300'>
                    {data.foodType === "veg" ? (
                        <div className='border-[1.5px] border-green-600 p-0.5 rounded-sm'>
                            <div className='w-1.5 h-1.5 bg-green-600 rounded-full'></div>
                        </div>
                    ) : (
                        <div className='border-[1.5px] border-red-600 p-0.5 rounded-sm'>
                            <div className='w-1.5 h-1.5 bg-red-600 rounded-full'></div>
                        </div>
                    )}
                </div>

                {/* Rating Badge Overlay */}
                <div className='absolute bottom-3 right-3 z-10 bg-gray-900/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20 shadow-lg'>
                    <FaStar className='text-orange-400 text-[10px]' />
                    <span className='text-white text-[11px] font-black'>{data.rating?.average || "4.2"}</span>
                </div>

                <img 
                    src={data.image} 
                    alt={data.name} 
                    className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110' 
                />
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col gap-1.5">
                <div className='flex justify-between items-start'>
                    <h1 className='font-black text-gray-900 text-[17px] leading-tight truncate transition-colors'>
                        {data.name}
                    </h1>
                </div>
                
                <p className='text-[11px] text-gray-500 font-bold uppercase tracking-tight'>
                    {data.shop?.name || "Premium Kitchen"}
                </p>

                <div className='flex items-center gap-0.5'>
                    {renderStars(data.rating?.average || 4)}
                </div>

                {/* STEP 3 & 5: Bottom Action Bar - bg-gray-100 and gray-300 divider logic */}
                <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-200'>
                    <div className='flex flex-col'>
                        <span className='text-[9px] uppercase font-black text-gray-400 tracking-widest'>Total</span>
                        <span className='font-black text-gray-900 text-xl tracking-tighter'>₹{data.price}</span>
                    </div>

                    {/* Quantity Controls - Inside a bg-gray-100 "well" */}
                    <div className='flex items-center bg-gray-100 rounded-2xl p-1 border border-gray-300'>
                        <div className='flex items-center'>
                            <button 
                                className='p-2 hover:bg-white text-gray-600 hover:text-[#ff4d2d] rounded-xl transition-all disabled:opacity-20' 
                                onClick={handleDecrease}
                                disabled={isAdded}
                            >
                                <FaMinus size={10} />
                            </button>
                            <span className='w-6 text-center text-xs font-black text-gray-800'>{quantity}</span>
                            <button 
                                className='p-2 hover:bg-white text-gray-600 hover:text-[#ff4d2d] rounded-xl transition-all disabled:opacity-20' 
                                onClick={handleIncrease}
                                disabled={isAdded}
                            >
                                <FaPlus size={10} />
                            </button>
                        </div>

                        {/* STEP 6: Cart Button with specific shadow depth */}
                        <button

                            className={`ml-1 p-3 rounded-xl transition-all duration-300 shadow-lg ${

                                isAdded

                                ? 'bg-green-500 text-white rotate-[360deg]'

                                : 'bg-[#ff4d2d] text-white hover:bg-[#e64528] active:scale-90'

                            }`}

                            onClick={handleAddToCart}

                            disabled={isAdded}

                        >

                            {isAdded ? <FaCheck size={14} /> : <FaCartPlus size={14} />}

                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FoodCard