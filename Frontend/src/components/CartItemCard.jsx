import React from 'react';
import { FaMinus, FaPlus } from "react-icons/fa6";
import { HiOutlineTrash } from "react-icons/hi2";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';

function CartItemCard({ data }) {
    const dispatch = useDispatch();

    const handleIncrease = (id, currentQty) => {
        dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
    };

    const handleDecrease = (id, currentQty) => {
        if (currentQty > 1) {
            dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
        }
    };

    return (
        <div className='group flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md hover:border-[#ff4d2d]/20 transition-all duration-300 gap-4 mb-3'>
            
            {/* Left Section: Image and Info */}
            <div className='flex items-center gap-5 w-full'>
                <div className='relative overflow-hidden rounded-xl w-24 h-24 flex-shrink-0'>
                    <img 
                        src={data.image} 
                        alt={data.name} 
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                </div>
                
                <div className='flex flex-col gap-1'>
                    <h1 className='font-bold text-gray-800 text-lg leading-tight group-hover:text-[#ff4d2d] transition-colors'>
                        {data.name}
                    </h1>
                    <div className='flex items-center gap-2'>
                        <span className='text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md'>
                            Unit: ₹{data.price}
                        </span>
                    </div>
                    <p className="text-xl font-black text-gray-900 mt-1">
                        ₹{data.price * data.quantity}
                    </p>
                </div>
            </div>

            {/* Right Section: Controls */}
            <div className='flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:gap-4'>
                
                {/* Quantity Toggler */}
                <div className='flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100'>
                    <button 
                        className={`p-2.5 rounded-lg transition-all ${data.quantity > 1 ? 'hover:bg-white hover:text-[#ff4d2d] text-gray-600 hover:shadow-sm' : 'text-gray-300 cursor-not-allowed'}`}
                        onClick={() => handleDecrease(data.id, data.quantity)}
                    >
                        <FaMinus size={12} />
                    </button>
                    
                    <span className='w-10 text-center font-bold text-gray-800 select-none'>
                        {data.quantity}
                    </span>
                    
                    <button 
                        className='p-2.5 rounded-lg hover:bg-white hover:text-[#ff4d2d] text-gray-600 hover:shadow-sm transition-all' 
                        onClick={() => handleIncrease(data.id, data.quantity)}
                    >
                        <FaPlus size={12} />
                    </button>
                </div>

                {/* Trash Button */}
                <button 
                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm shadow-red-100"
                    onClick={() => dispatch(removeCartItem(data.id))}
                    title="Remove Item"
                >
                    <HiOutlineTrash size={20} />
                </button>
            </div>
        </div>
    );
}

export default CartItemCard;