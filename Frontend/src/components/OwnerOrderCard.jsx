import axios from 'axios';
import React, { useState } from 'react';
import { MdPhone, MdEmail, MdLocationOn, MdCreditCard, MdOutlineFastfood } from "react-icons/md";
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';

function OwnerOrderCard({ data }) {
    const [availableBoys, setAvailableBoys] = useState([]);
    const dispatch = useDispatch();

    const handleUpdateStatus = async (orderId, shopId, status) => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, { status }, { withCredentials: true });
            dispatch(updateOrderStatus({ orderId, shopId, status }));
            setAvailableBoys(result.data.availableBoys);
        } catch (error) {
            console.log(error);
        }
    };

    // Helper for Status Badge Styling
    const getStatusColor = (status) => {
        switch (status) {
            case 'preparing': return 'bg-blue-100 text-blue-600';
            case 'out of delivery': return 'bg-orange-100 text-orange-600';
            case 'delivered': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className='bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col gap-6 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'>
            
            {/* Header: Customer Info & Payment */}
            <div className='flex flex-wrap justify-between items-start gap-4'>
                <div className='space-y-1'>
                    <h2 className='text-xl font-bold text-gray-900 tracking-tight'>{data.user.fullName}</h2>
                    <div className='flex flex-col gap-1'>
                        <p className='flex items-center gap-2 text-sm text-gray-500'>
                            <MdEmail size={16} className='text-gray-400' />
                            {data.user.email}
                        </p>
                        <p className='flex items-center gap-2 text-sm text-gray-500 font-medium'>
                            <MdPhone size={16} className='text-[#ff4d2d]' />
                            {data.user.mobile}
                        </p>
                    </div>
                </div>
                <div className='flex flex-col items-end gap-2'>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${data.payment || data.paymentMethod === 'cod' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {data.paymentMethod === "online" ? (data.payment ? "PAID ONLINE" : "PAYMENT FAILED") : `CASH ON DELIVERY`}
                    </div>
                    <span className='text-xs text-gray-400 font-medium'>OrderID: #{data._id.slice(-6).toUpperCase()}</span>
                </div>
            </div>

            {/* Delivery Address Section */}
            <div className='bg-gray-50 rounded-2xl p-4 flex gap-3'>
                <MdLocationOn className='text-gray-400 mt-1 shrink-0' size={20} />
                <div className='space-y-1'>
                    <p className='text-sm text-gray-700 leading-relaxed font-medium'>{data?.deliveryAddress?.text}</p>
                    <p className='text-[10px] text-gray-400 font-bold uppercase'>GPS: {data?.deliveryAddress.latitude.toFixed(4)}, {data?.deliveryAddress.longitude.toFixed(4)}</p>
                </div>
            </div>

            {/* Items Horizontal Scroll */}
            <div className='space-y-3'>
                <div className='flex items-center gap-2 text-gray-800 font-bold text-sm'>
                    <MdOutlineFastfood className='text-[#ff4d2d]' />
                    <h3>Order Items</h3>
                </div>
                <div className='flex space-x-4 overflow-x-auto pb-4 no-scrollbar'>
                    {data.shopOrders.shopOrderItems.map((item, index) => (
                        <div key={index} className='flex-shrink-0 w-44 bg-white border border-gray-100 rounded-2xl p-2 shadow-sm'>
                            <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded-xl mb-2' />
                            <div className='px-1'>
                                <p className='text-sm font-bold text-gray-800 truncate'>{item.name}</p>
                                <p className='text-xs text-gray-500 font-medium'>Qty: {item.quantity} • ₹{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status Update & Delivery Boy */}
            <div className='space-y-4'>
                <div className='flex justify-between items-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100'>
                    <div className='flex items-center gap-3'>
                        <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tight ${getStatusColor(data.shopOrders.status)}`}>
                            {data.shopOrders.status}
                        </span>
                    </div>

                    <select 
                        className='bg-white rounded-xl border-none px-4 py-2 text-xs font-bold shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-[#ff4d2d] outline-none text-gray-700 cursor-pointer'
                        onChange={(e) => handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value)}
                        value={data.shopOrders.status}
                    >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="out of delivery">Out Of Delivery</option>
                    </select>
                </div>

                {data.shopOrders.status === "out of delivery" && (
                    <div className="p-4 border border-orange-100 rounded-2xl text-sm bg-orange-50/50 space-y-3 animate-in fade-in duration-500">
                        <p className='text-[10px] font-black text-orange-600 uppercase tracking-widest'>
                            {data.shopOrders.assignedDeliveryBoy ? "Assigned Rider" : "Nearby Riders"}
                        </p>
                        <div className='space-y-2'>
                            {availableBoys?.length > 0 ? (
                                availableBoys.map((b, index) => (
                                    <div key={index} className='flex items-center justify-between bg-white p-3 rounded-xl border border-orange-100'>
                                        <span className='font-bold text-gray-800'>{b.fullName}</span>
                                        <span className='text-[#ff4d2d] font-medium flex items-center gap-1'><MdPhone size={14}/> {b.mobile}</span>
                                    </div>
                                ))
                            ) : data.shopOrders.assignedDeliveryBoy ? (
                                <div className='flex items-center justify-between bg-white p-3 rounded-xl border border-orange-100'>
                                    <span className='font-bold text-gray-800'>{data.shopOrders.assignedDeliveryBoy.fullName}</span>
                                    <span className='text-[#ff4d2d] font-medium flex items-center gap-1'><MdPhone size={14}/> {data.shopOrders.assignedDeliveryBoy.mobile}</span>
                                </div>
                            ) : (
                                <div className='flex items-center gap-2 text-orange-400 italic py-1'>
                                    <div className='h-2 w-2 bg-orange-400 rounded-full animate-pulse' />
                                    Waiting for rider to accept...
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer: Total */}
            <div className='flex justify-between items-center pt-4 border-t border-dashed border-gray-100'>
                <span className='text-gray-400 font-bold text-xs uppercase tracking-widest'>Order Total</span>
                <div className='flex items-center gap-1'>
                    <span className='text-2xl font-black text-gray-900'>₹{data.shopOrders.subtotal}</span>
                </div>
            </div>
        </div>
    );
}

export default OwnerOrderCard;