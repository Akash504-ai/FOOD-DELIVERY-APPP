import React from 'react'
import Nav from './Nav.jsx'
import { useSelector } from 'react-redux'
import { FaUtensils, FaPen, FaPlus, FaMapMarkerAlt, FaStore } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import OwnerItemCard from './OwnerItemCard.jsx';

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()

  return (
    <div className='w-full min-h-screen bg-gray-100 flex flex-col items-center pb-20'>
      <Nav />

      {/* CASE 1: NO SHOP CREATED */}
      {!myShopData && (
        <div className='flex flex-col justify-center items-center p-6 min-h-[80vh]'>
          {/* Deep Soft Shadow + Subtle Ring */}
          <div className='w-full max-w-lg bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-300 rounded-[2.5rem] p-10 text-center ring-4 ring-white/50'>
            <div className='bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner'>
              <FaStore className='text-[#ff4d2d] w-12 h-12' />
            </div>
            <h2 className='text-3xl font-black text-gray-900 mb-3 tracking-tight'>Start Your Journey</h2>
            <p className='text-gray-500 mb-8 leading-relaxed'>
              Expand your reach and join the future of food delivery. Add your restaurant details to get started.
            </p>
            <button 
              className='bg-[#ff4d2d] text-white px-8 py-4 rounded-2xl font-bold shadow-[0_10px_20px_rgba(255,77,45,0.3)] hover:shadow-[0_15px_30px_rgba(255,77,45,0.4)] hover:scale-[1.02] transition-all duration-300' 
              onClick={() => navigate("/create-edit-shop")}
            >
              Register Restaurant
            </button>
          </div>
        </div>
      )}

      {/* CASE 2: SHOP EXISTS */}
      {myShopData && (
        <div className='w-full max-w-6xl flex flex-col gap-8 px-4 sm:px-8 mt-10'>
          
          {/* Shop Hero Card */}
          <div className='relative group'>
            {/* Added a massive ambient shadow to the hero */}
            <div className='w-full h-[300px] sm:h-[400px] rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] relative border border-gray-300'>
              <img 
                src={myShopData.image} 
                alt={myShopData.name} 
                className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent' />
              
              {/* Floating Edit Button */}
              <button 
                className='absolute top-6 right-6 bg-white/10 backdrop-blur-xl text-white p-4 rounded-2xl border border-white/20 hover:bg-[#ff4d2d] hover:border-[#ff4d2d] transition-all shadow-xl'
                onClick={() => navigate("/create-edit-shop")}
              >
                <FaPen size={18}/>
              </button>

              <div className='absolute bottom-8 left-8 sm:left-12'>
                <div className='flex items-center gap-3 bg-[#ff4d2d] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 w-fit shadow-lg shadow-orange-900/20'>
                   <FaUtensils size={10} /> Restaurant Dashboard
                </div>
                <h1 className='text-4xl sm:text-5xl font-black text-white mb-2 leading-tight drop-shadow-md'>
                  {myShopData.name}
                </h1>
                <div className='flex items-center gap-2 text-gray-200 font-medium drop-shadow-sm'>
                  <FaMapMarkerAlt className='text-orange-400' />
                  <p>{myShopData.address}, {myShopData.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Stats & Content Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            
            {/* Sidebar Stats */}
            <div className='lg:col-span-1 space-y-6'>
              {/* Card with Tight Shadow */}
              <div className='bg-white p-7 rounded-[2.5rem] border border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'>
                <h3 className='text-lg font-bold text-gray-800 mb-5'>Quick Stats</h3>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center p-5 bg-gray-50 rounded-3xl border border-gray-200/50 shadow-inner'>
                    <span className='text-gray-500 font-semibold'>Total Items</span>
                    <span className='text-2xl font-black text-[#ff4d2d]'>{myShopData.items.length}</span>
                  </div>
                  <div className='flex justify-between items-center p-5 bg-gray-50 rounded-3xl border border-gray-200/50 shadow-inner'>
                    <span className='text-gray-500 font-semibold'>Shop Status</span>
                    <span className='px-4 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-wider border border-green-200'>Active</span>
                  </div>
                </div>
              </div>

              {/* Action Button with "Glow" Shadow */}
              <button 
                className='w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-6 rounded-[2.5rem] font-bold hover:bg-black transition-all shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.2)] hover:-translate-y-1'
                onClick={() => navigate("/add-item")}
              >
                <FaPlus className='text-orange-500' /> Add New Food Item
              </button>
            </div>

            {/* Menu Items Section */}
            <div className='lg:col-span-2'>
              <div className='flex items-center justify-between mb-8'>
                <h2 className='text-2xl font-black text-gray-800 tracking-tight'>Live Menu</h2>
                <div className='h-[2px] flex-grow mx-6 bg-gray-300 rounded-full opacity-50' />
              </div>

              {myShopData.items.length === 0 ? (
                <div className='bg-white rounded-[3rem] border-2 border-dashed border-gray-400 p-16 text-center shadow-[0_10px_40px_rgba(0,0,0,0.02)]'>
                  <div className='bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner'>
                    <FaPlus className='text-gray-300 w-10 h-10' />
                  </div>
                  <h3 className='text-2xl font-bold text-gray-800 mb-2'>Your Menu is Empty</h3>
                  <p className='text-gray-500 mb-8 max-w-xs mx-auto text-sm'>Add your first signature dish to start receiving orders from customers.</p>
                  <button 
                    className='text-[#ff4d2d] font-black hover:text-[#e64429] transition-colors underline underline-offset-8'
                    onClick={() => navigate("/add-item")}
                  >
                    Click here to add food
                  </button>
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-6'>
                  {myShopData.items.map((item, index) => (
                    <div key={index} className='hover:translate-y-[-6px] transition-all duration-500'>
                      {/* Assuming OwnerItemCard has its own internal card styling */}
                      <OwnerItemCard data={item} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OwnerDashboard;