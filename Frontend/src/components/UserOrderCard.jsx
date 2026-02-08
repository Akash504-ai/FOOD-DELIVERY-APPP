import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { HiOutlineShoppingBag, HiOutlineCalendar, HiStar } from 'react-icons/hi2'
import { IoReceiptOutline } from "react-icons/io5";

function UserOrderCard({ data }) {
    const navigate = useNavigate()
    const [selectedRating, setSelectedRating] = useState({}) // itemId: rating

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const handleRating = async (itemId, rating) => {
        try {
            await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating }, { withCredentials: true })
            setSelectedRating(prev => ({
                ...prev, [itemId]: rating
            }))
        } catch (error) {
            console.log(error)
        }
    }

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'bg-emerald-100 text-emerald-700'
            case 'pending': return 'bg-amber-100 text-amber-700'
            case 'cancelled': return 'bg-rose-100 text-rose-700'
            default: return 'bg-blue-100 text-blue-700'
        }
    }

    return (
        <div className='group bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 space-y-6 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-500'>
            
            {/* --- Header: Order Info --- */}
            <div className='flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-dashed border-gray-200'>
                <div className='flex items-center gap-4'>
                    <div className='p-3 bg-gray-50 rounded-2xl text-[#ff4d2d]'>
                        <IoReceiptOutline size={24} />
                    </div>
                    <div>
                        <h3 className='font-black text-gray-800 uppercase tracking-tight'>
                            Order <span className='text-[#ff4d2d]'>#{data._id.slice(-6)}</span>
                        </h3>
                        <div className='flex items-center gap-2 text-xs font-bold text-gray-400 mt-1'>
                            <HiOutlineCalendar size={14} />
                            {formatDate(data.createdAt)}
                        </div>
                    </div>
                </div>
                
                <div className='text-right'>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusStyles(data.shopOrders?.[0]?.status)}`}>
                        {data.shopOrders?.[0]?.status}
                    </span>
                    <p className='text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter'>
                        Method: {data.paymentMethod === "cod" ? "Cash" : "Prepaid"}
                    </p>
                </div>
            </div>

            {/* --- Shop Orders List --- */}
            <div className='space-y-4'>
                {data.shopOrders.map((shopOrder, idx) => (
                    <div key={idx} className='bg-gray-50/50 rounded-3xl p-5 border border-transparent hover:border-gray-200 transition-colors'>
                        <div className='flex items-center gap-2 mb-4'>
                            <HiOutlineShoppingBag className='text-[#ff4d2d]' />
                            <p className='font-bold text-gray-800 text-sm'>{shopOrder.shop.name}</p>
                        </div>

                        {/* Items Horizontal Scroll */}
                        <div className='flex space-x-4 overflow-x-auto no-scrollbar pb-2'>
                            {shopOrder.shopOrderItems.map((item, itemIdx) => (
                                <div key={itemIdx} className='flex-shrink-0 w-44 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm'>
                                    <div className='relative h-24 w-full rounded-xl overflow-hidden mb-2'>
                                        <img src={item.item.image} alt="" className='w-full h-full object-cover' />
                                    </div>
                                    <p className='text-xs font-black text-gray-800 truncate'>{item.name}</p>
                                    <p className='text-[10px] font-bold text-gray-400'>Qty: {item.quantity} × ₹{item.price}</p>

                                    {/* Rating Logic */}
                                    {shopOrder.status === "delivered" && (
                                        <div className='flex items-center gap-1 mt-3 pt-2 border-t border-gray-50'>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button 
                                                    key={star}
                                                    className={`transition-all transform hover:scale-125 ${
                                                        (selectedRating[item.item._id] || 0) >= star 
                                                        ? 'text-amber-400 scale-110' 
                                                        : 'text-gray-200 hover:text-amber-200'
                                                    }`} 
                                                    onClick={() => handleRating(item.item._id, star)}
                                                >
                                                    <HiStar size={16} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Footer: Total & Actions --- */}
            <div className='flex items-center justify-between pt-4 bg-gradient-to-r from-transparent via-transparent to-gray-50 rounded-b-[2rem]'>
                <div className='flex flex-col'>
                    <span className='text-[10px] uppercase font-bold text-gray-400 tracking-widest'>Total Amount</span>
                    <p className='text-2xl font-black text-gray-900'>₹{data.totalAmount}</p>
                </div>
                
                <button 
                    className='group/btn relative overflow-hidden bg-[#ff4d2d] text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-[#ff4d2d]/20 hover:shadow-[#ff4d2d]/40 transition-all active:scale-95' 
                    onClick={() => navigate(`/track-order/${data._id}`)}
                >
                    <span className='relative z-10'>Track Order</span>
                    <div className='absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300' />
                </button>
            </div>
        </div>
    )
}

export default UserOrderCard