import React, { useState } from 'react'
import { FaLeaf, FaDrumstickBite, FaStar, FaPlus, FaMinus, FaCheck } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';

function FoodCard({ data }) {
    const [quantity, setQuantity] = useState(1); // Default to 1 for better UX when clicking add
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.user);
    const isAdded = cartItems.some(i => i.id === data._id);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar key={i} className={`${i <= rating ? 'text-orange-400' : 'text-gray-200'} text-xs`} />
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
        <div className='group w-full max-w-[280px] bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 relative'>
            
            {/* Image Container */}
            <div className='relative w-full h-[200px] overflow-hidden'>
                {/* Veg/Non-Veg Floating Badge */}
                <div className='absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-gray-100'>
                    {data.foodType === "veg" ? (
                        <div className='border-2 border-green-600 p-0.5 rounded-sm'>
                            <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                        </div>
                    ) : (
                        <div className='border-2 border-red-600 p-0.5 rounded-sm'>
                            <div className='w-2 h-2 bg-red-600 rounded-full'></div>
                        </div>
                    )}
                </div>

                {/* Rating Badge Overlay */}
                <div className='absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-white/20'>
                    <FaStar className='text-orange-400 text-[10px]' />
                    <span className='text-white text-xs font-bold'>{data.rating?.average || "4.2"}</span>
                    <span className='text-white/60 text-[10px]'>({data.rating?.count || 0})</span>
                </div>

                <img 
                    src={data.image} 
                    alt={data.name} 
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
                />
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col gap-2">
                <div className='flex justify-between items-start'>
                    <h1 className='font-black text-gray-800 text-lg leading-tight truncate group-hover:text-[#ff4d2d] transition-colors'>
                        {data.name}
                    </h1>
                </div>
                
                <p className='text-xs text-gray-400 font-medium line-clamp-1'>
                    From {data.shop?.name || "Premium Kitchen"}
                </p>

                <div className='flex items-center gap-1 mt-1'>
                    {renderStars(data.rating?.average || 4)}
                </div>

                {/* Bottom Action Bar */}
                <div className='flex items-center justify-between mt-4'>
                    <div className='flex flex-col'>
                        <span className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>Price</span>
                        <span className='font-black text-gray-900 text-xl'>₹{data.price}</span>
                    </div>

                    <div className='flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100'>
                        <div className='flex items-center'>
                            <button 
                                className='p-2 hover:bg-white hover:text-[#ff4d2d] rounded-xl transition-all disabled:opacity-30' 
                                onClick={handleDecrease}
                                disabled={isAdded}
                            >
                                <FaMinus size={10} />
                            </button>
                            <span className='w-6 text-center text-sm font-bold text-gray-700'>{quantity}</span>
                            <button 
                                className='p-2 hover:bg-white hover:text-[#ff4d2d] rounded-xl transition-all disabled:opacity-30' 
                                onClick={handleIncrease}
                                disabled={isAdded}
                            >
                                <FaPlus size={10} />
                            </button>
                        </div>

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