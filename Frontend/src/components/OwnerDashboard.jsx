import React from 'react'
import Nav from './NaV.JSX'
import { useSelector } from 'react-redux'
import { FaUtensils, FaPen, FaPlus, FaMapMarkerAlt, FaStore } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import OwnerItemCard from './ownerItemCard';

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()

  return (
    <div className='w-full min-h-screen bg-[#fdfdfd] flex flex-col items-center pb-20'>
      <Nav />

      {/* CASE 1: NO SHOP CREATED */}
      {!myShopData && (
        <div className='flex flex-col justify-center items-center p-6 min-h-[80vh]'>
          <div className='w-full max-w-lg bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-10 border border-gray-100 text-center'>
            <div className='bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6'>
              <FaStore className='text-[#ff4d2d] w-12 h-12' />
            </div>
            <h2 className='text-3xl font-black text-gray-900 mb-3 tracking-tight'>Start Your Journey</h2>
            <p className='text-gray-500 mb-8 leading-relaxed'>
              Expand your reach and join the future of food delivery. Add your restaurant details to get started.
            </p>
            <button 
              className='bg-[#ff4d2d] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-[#e64429] hover:scale-105 transition-all duration-300' 
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
            <div className='w-full h-[300px] sm:h-[400px] rounded-[3rem] overflow-hidden shadow-2xl relative'>
              <img 
                src={myShopData.image} 
                alt={myShopData.name} 
                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
              
              {/* Floating Edit Button */}
              <button 
                className='absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white p-4 rounded-2xl border border-white/30 hover:bg-[#ff4d2d] hover:border-[#ff4d2d] transition-all'
                onClick={() => navigate("/create-edit-shop")}
              >
                <FaPen size={18}/>
              </button>

              <div className='absolute bottom-8 left-8 sm:left-12'>
                <div className='flex items-center gap-3 bg-[#ff4d2d] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 w-fit'>
                   <FaUtensils size={10} /> Restaurant Dashboard
                </div>
                <h1 className='text-4xl sm:text-5xl font-black text-white mb-2 leading-tight'>
                  {myShopData.name}
                </h1>
                <div className='flex items-center gap-2 text-gray-200 font-medium'>
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
              <div className='bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm'>
                <h3 className='text-lg font-bold text-gray-800 mb-4'>Quick Stats</h3>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center p-4 bg-gray-50 rounded-2xl'>
                    <span className='text-gray-500 font-medium'>Total Items</span>
                    <span className='text-xl font-black text-[#ff4d2d]'>{myShopData.items.length}</span>
                  </div>
                  <div className='flex justify-between items-center p-4 bg-gray-50 rounded-2xl'>
                    <span className='text-gray-500 font-medium'>Shop Status</span>
                    <span className='px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-lg uppercase'>Active</span>
                  </div>
                </div>
              </div>

              <button 
                className='w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-5 rounded-[2rem] font-bold hover:bg-black transition-all shadow-xl shadow-gray-200'
                onClick={() => navigate("/add-item")}
              >
                <FaPlus /> Add New Food Item
              </button>
            </div>

            {/* Menu Items Section */}
            <div className='lg:col-span-2'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-black text-gray-800'>Live Menu</h2>
                <div className='h-1 flex-grow mx-4 bg-gray-100 rounded-full' />
              </div>

              {myShopData.items.length === 0 ? (
                <div className='bg-white rounded-[2rem] border-2 border-dashed border-gray-200 p-12 text-center'>
                  <div className='bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <FaPlus className='text-gray-300 w-8 h-8' />
                  </div>
                  <h3 className='text-xl font-bold text-gray-800 mb-2'>Your Menu is Empty</h3>
                  <p className='text-gray-500 mb-6'>Add your first signature dish to start receiving orders.</p>
                  <button 
                    className='text-[#ff4d2d] font-bold hover:underline'
                    onClick={() => navigate("/add-item")}
                  >
                    Click here to add food
                  </button>
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-4'>
                  {myShopData.items.map((item, index) => (
                    <div key={index} className='hover:translate-y-[-4px] transition-transform duration-300'>
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