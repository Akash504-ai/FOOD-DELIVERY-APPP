import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiInbox } from "react-icons/fi";
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
    <div className='w-full min-h-screen bg-[#fdfdfd] flex flex-col items-center'>
      
      {/* Premium Sticky Header */}
      <div className='w-full sticky top-0 z-[50] bg-white/80 backdrop-blur-lg border-b border-gray-100'>
        <div className='max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button 
              onClick={() => navigate("/")}
              className='p-2 hover:bg-orange-50 rounded-full transition-all group'
            >
              <IoIosArrowRoundBack size={32} className='text-gray-700 group-hover:text-[#ff4d2d]' />
            </button>
            <div className='flex flex-col'>
              <h1 className='text-xl font-black text-gray-900 tracking-tight'>
                {userData.role === "owner" ? "Shop Orders" : "My Orders"}
              </h1>
              <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>
                {myOrders?.length || 0} Total Records
              </p>
            </div>
          </div>
          <div className='h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#ff4d2d]'>
            <FiShoppingBag size={20} />
          </div>
        </div>
      </div>

      <div className='w-full max-w-[850px] p-6'>
        {/* Orders Feed */}
        <div className='flex flex-col gap-6 mb-10'>
          {myOrders && myOrders.length > 0 ? (
            myOrders.map((order, index) => (
              <div key={index} className='animate-in fade-in slide-in-from-bottom-4 duration-500' style={{ animationDelay: `${index * 50}ms` }}>
                {userData.role === "user" ? (
                  <UserOrderCard data={order} />
                ) : userData.role === "owner" ? (
                  <OwnerOrderCard data={order} />
                ) : null}
              </div>
            ))
          ) : (
            /* Modern Empty State */
            <div className='flex flex-col items-center justify-center py-24 text-center'>
              <div className='bg-gray-50 p-8 rounded-[2.5rem] mb-6'>
                <FiInbox size={64} className='text-gray-200' />
              </div>
              <h2 className='text-2xl font-black text-gray-800 mb-2'>No orders yet</h2>
              <p className='text-gray-500 max-w-xs'>
                {userData.role === "owner" 
                  ? "Hang tight! New orders from hungry customers will appear here." 
                  : "Looks like you haven't ordered anything yet. Let's find something delicious!"}
              </p>
              {userData.role === "user" && (
                <button 
                  onClick={() => navigate("/")}
                  className='mt-8 bg-[#ff4d2d] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-all'
                >
                  Explore Menu
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyOrders;