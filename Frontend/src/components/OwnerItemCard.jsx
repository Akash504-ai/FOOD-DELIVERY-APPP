import axios from 'axios';
import React from 'react';
import { FaPen, FaTrashAlt, FaLeaf } from "react-icons/fa";
import { MdOutlineFastfood, MdCategory } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

function OwnerItemCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`, { withCredentials: true });
        dispatch(setMyShopData(result.data));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className='group flex bg-white rounded-[2rem] shadow-sm hover:shadow-xl border border-gray-100 hover:border-orange-100 overflow-hidden transition-all duration-300 w-full max-w-3xl'>
      
      {/* Image Container */}
      <div className='w-32 sm:w-44 flex-shrink-0 relative overflow-hidden'>
        <img 
          src={data.image} 
          alt={data.name} 
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
        />
        {/* Food Type Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg backdrop-blur-md border flex items-center gap-1 ${
          data.foodType?.toLowerCase() === 'veg' 
          ? 'bg-green-50/80 border-green-200 text-green-600' 
          : 'bg-red-50/80 border-red-200 text-red-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${data.foodType?.toLowerCase() === 'veg' ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className='text-[10px] font-black uppercase tracking-wider'>{data.foodType}</span>
        </div>
      </div>

      {/* Content Container */}
      <div className='flex flex-col justify-between p-5 flex-1 min-w-0'>
        <div className='space-y-2'>
          <div className='flex justify-between items-start'>
            <h2 className='text-lg sm:text-xl font-black text-gray-800 truncate pr-2'>
              {data.name}
            </h2>
            <span className='text-xl font-black text-[#ff4d2d]'>
              ₹{data.price}
            </span>
          </div>
          
          <div className='flex flex-wrap gap-3'>
            <div className='flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100'>
              <MdCategory className='text-gray-400' size={14} />
              <span className='text-xs font-bold text-gray-500 uppercase tracking-tight'>{data.category}</span>
            </div>
            <div className='flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100'>
              <MdOutlineFastfood className='text-gray-400' size={14} />
              <span className='text-xs font-bold text-gray-500 uppercase tracking-tight'>{data.foodType}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center justify-end gap-3 mt-4'>
          <button 
            className='flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 text-[#ff4d2d] hover:bg-[#ff4d2d] hover:text-white transition-all duration-300 font-bold text-sm shadow-sm'
            onClick={() => navigate(`/edit-item/${data._id}`)}
          >
            <FaPen size={12} />
            <span className='hidden sm:inline'>Edit</span>
          </button>
          
          <button 
            className='flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-sm shadow-sm'
            onClick={handleDelete}
          >
            <FaTrashAlt size={12} />
            <span className='hidden sm:inline'>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default OwnerItemCard;