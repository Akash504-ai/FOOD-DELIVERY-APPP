import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiInbox, FiClock } from "react-icons/fi";
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice';

function MyOrders() {
  const { userData, myOrders, socket } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    socket?.on('newOrder', (data) => {
      if (data.shopOrders?.owner._id === userData._id) {
        dispatch(setMyOrders([data, ...myOrders]))
      }
    })

    socket?.on('update-status', ({ orderId, shopId, status, userId }) => {
      if (userId === userData._id) {
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }))
      }
    })

    return () => {
      socket?.off('newOrder')
      socket?.off('update-status')
    }
  }, [socket, myOrders, userData._id, dispatch])

  return (
    /* Background: Darkened to Slate-100 for maximum card visibility */
    <div className='w-full min-h-screen bg-[#f1f5f9] flex flex-col items-center relative'>
      
      {/* Decorative Gradient Background (Not White) */}
      <div className='absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-orange-50 to-transparent opacity-60 pointer-events-none' />

      {/* Premium Sticky Header: Stronger border and shadow */}
      <div className='w-full sticky top-0 z-[50] bg-white border-b border-gray-300 shadow-md'>
        <div className='max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button 
              onClick={() => navigate("/")}
              className='p-2 bg-gray-100 border border-gray-300 text-gray-800 hover:text-white hover:bg-[#ff4d2d] hover:border-[#ff4d2d] rounded-xl transition-all shadow-sm'
            >
              <IoIosArrowRoundBack size={28} />
            </button>
            <div className='flex flex-col'>
              <h1 className='text-2xl font-black text-slate-900 tracking-tight'>
                {userData.role === "owner" ? "Shop Orders" : "My Orders"}
              </h1>
              <div className='flex items-center gap-2'>
                <p className='text-[11px] text-slate-500 font-black uppercase tracking-widest'>
                  {myOrders?.length || 0} Records Found
                </p>
              </div>
            </div>
          </div>
          
          <div className='h-12 w-12 bg-[#ff4d2d] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200'>
            <FiShoppingBag size={22} />
          </div>
        </div>
      </div>

      {/* Main Container with subtle depth */}
      <div className='w-full max-w-[850px] p-6 mt-4'>
        
        {/* Orders Feed */}
        <div className='flex flex-col gap-8 mb-20'>
          {myOrders && myOrders.length > 0 ? (
            myOrders.map((order, index) => (
              <div 
                key={index} 
                className='relative animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-both' 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Border Container: This ensures the card has a clear edge even if the Card component itself is white */}
                <div className='bg-white rounded-[2rem] border border-gray-300 shadow-xl overflow-hidden hover:border-[#ff4d2d] transition-colors duration-300'>
                  {userData.role === "user" ? (
                    <UserOrderCard data={order} />
                  ) : userData.role === "owner" ? (
                    <OwnerOrderCard data={order} />
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            /* Enhanced Empty State for Visibility */
            <div className='flex flex-col items-center justify-center py-20 px-6 text-center bg-gray-200/50 border-2 border-dashed border-gray-400 rounded-[3rem] mt-10'>
              <div className='bg-white border border-gray-300 shadow-2xl p-10 rounded-[3rem] mb-8'>
                <FiInbox size={70} className='text-slate-300' />
              </div>
              <h2 className='text-3xl font-black text-slate-800 mb-3'>No activity yet</h2>
              <p className='text-slate-600 max-w-sm leading-relaxed font-medium mb-10'>
                {userData.role === "owner" 
                  ? "Your shop is ready! Once customers start ordering, they will appear here in real-time." 
                  : "You haven't placed any orders. Discover the best food in your area and satisfy your cravings!"}
              </p>
              {userData.role === "user" && (
                <button 
                  onClick={() => navigate("/")}
                  className='bg-[#ff4d2d] hover:bg-[#e64323] text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-orange-200 transition-all flex items-center gap-3'
                >
                  Start Ordering Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding Overlay (Optional) */}
      {/* <div className='fixed bottom-4 right-4 pointer-events-none opacity-20'>
        <h2 className='text-4xl font-black text-slate-900 tracking-tighter'>Foodigo.</h2>
      </div> */}
    </div>
  )
}

export default MyOrders;