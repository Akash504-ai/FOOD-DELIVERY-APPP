import React, { useEffect, useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUtensils, FaCloudUploadAlt, FaLeaf, FaDrumstickBite } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';

function EditItem() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { itemId } = useParams();
    const { myShopData } = useSelector(state => state.owner);
    
    const [currentItem, setCurrentItem] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [frontendImage, setFrontendImage] = useState("");
    const [backendImage, setBackendImage] = useState(null);
    const [category, setCategory] = useState("");
    const [foodType, setFoodType] = useState("");
    const [loading, setLoading] = useState(false);

    const categories = [
        "Snacks", "Main Course", "Desserts", "Pizza", "Burgers", 
        "Sandwiches", "South Indian", "North Indian", "Chinese", 
        "Fast Food", "Others"
    ];

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackendImage(file);
            setFrontendImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("category", category);
            formData.append("foodType", foodType);
            formData.append("price", price);
            if (backendImage) {
                formData.append("image", backendImage);
            }
            const result = await axios.post(`${serverUrl}/api/item/edit-item/${itemId}`, formData, { withCredentials: true });
            dispatch(setMyShopData(result.data));
            setLoading(false);
            navigate("/");
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleGetItemById = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`, { withCredentials: true });
                setCurrentItem(result.data);
            } catch (error) {
                console.log(error);
            }
        };
        handleGetItemById();
    }, [itemId]);

    useEffect(() => {
        if (currentItem) {
            setName(currentItem.name || "");
            setPrice(currentItem.price || 0);
            setCategory(currentItem.category || "");
            setFoodType(currentItem.foodType || "");
            setFrontendImage(currentItem.image || "");
        }
    }, [currentItem]);

    return (
        <div className='min-h-screen bg-[#fdfdfd] flex flex-col items-center py-12 px-4 relative overflow-hidden'>
            {/* Background Decorative Blurs */}
            <div className='absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50' />
            <div className='absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50' />

            {/* Back Navigation */}
            <button 
                onClick={() => navigate("/")}
                className='absolute top-6 left-6 z-20 p-2 bg-white shadow-md rounded-full hover:bg-orange-50 transition-all group border border-gray-100'
            >
                <IoIosArrowRoundBack size={32} className='text-gray-700 group-hover:text-[#ff4d2d]' />
            </button>

            <div className='max-w-2xl w-full z-10'>
                {/* Header Section */}
                <div className='text-center mb-10'>
                    <div className='inline-flex bg-white p-4 rounded-3xl mb-4 shadow-sm border border-orange-50'>
                        <FaUtensils className='text-[#ff4d2d] w-10 h-10' />
                    </div>
                    <h1 className='text-4xl font-black text-gray-900 tracking-tight'>
                        Edit <span className='text-[#ff4d2d]'>Item</span>
                    </h1>
                    <p className='text-gray-500 mt-2 font-medium italic'>Update your dish details and keep your menu fresh</p>
                </div>

                {/* Form Container */}
                <form 
                    className='bg-white/80 backdrop-blur-xl shadow-2xl shadow-orange-100/40 rounded-[2.5rem] p-8 md:p-12 border border-white' 
                    onSubmit={handleSubmit}
                >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        
                        {/* Name Input */}
                        <div className='md:col-span-2'>
                            <label className='block text-sm font-bold text-gray-700 mb-2 ml-1'>Dish Name</label>
                            <input 
                                type="text" 
                                placeholder='Enter Item Name' 
                                className='w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#ff4d2d] transition-all font-semibold text-gray-800 shadow-inner'
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                required
                            />
                        </div>

                        {/* Image Upload Area */}
                        <div className='md:col-span-2'>
                            <label className='block text-sm font-bold text-gray-700 mb-2 ml-1'>Food Photo</label>
                            <div className='relative group'>
                                <input 
                                    type="file" 
                                    accept='image/*' 
                                    className='absolute inset-0 opacity-0 cursor-pointer z-10' 
                                    onChange={handleImage} 
                                />
                                <div className={`w-full h-52 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden relative ${frontendImage ? 'border-orange-400' : 'border-gray-200 bg-gray-50 group-hover:border-[#ff4d2d]'}`}>
                                    {frontendImage ? (
                                        <>
                                            <img src={frontendImage} alt="preview" className='w-full h-full object-cover transition-transform group-hover:scale-105' />
                                            <div className='absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100'>
                                                <p className='text-white font-bold flex items-center gap-2'><FaCloudUploadAlt /> Change Image</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <FaCloudUploadAlt className='w-12 h-12 text-gray-300 group-hover:text-[#ff4d2d] transition-colors mb-2' />
                                            <p className='text-sm text-gray-400 font-bold'>Upload high-quality image</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Price Input */}
                        <div>
                            <label className='block text-sm font-bold text-gray-700 mb-2 ml-1'>Price (₹)</label>
                            <input 
                                type="number" 
                                placeholder='0.00' 
                                className='w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#ff4d2d] transition-all font-black text-lg shadow-inner'
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                required
                            />
                        </div>

                        {/* Category Select */}
                        <div>
                            <label className='block text-sm font-bold text-gray-700 mb-2 ml-1'>Category</label>
                            <div className='relative'>
                                <select 
                                    className='w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#ff4d2d] transition-all font-medium appearance-none cursor-pointer shadow-inner'
                                    onChange={(e) => setCategory(e.target.value)}
                                    value={category}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cate, index) => (
                                        <option value={cate} key={index}>{cate}</option>
                                    ))}
                                </select>
                                <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400'>
                                    ▼
                                </div>
                            </div>
                        </div>

                        {/* Food Type Toggle */}
                        <div className='md:col-span-2'>
                            <label className='block text-sm font-bold text-gray-700 mb-3 ml-1'>Dietary Type</label>
                            <div className='flex gap-4'>
                                <button 
                                    type="button"
                                    onClick={() => setFoodType("veg")}
                                    className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border-2 ${foodType === 'veg' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-100 text-gray-400 hover:border-green-200'}`}
                                >
                                    <FaLeaf className={foodType === 'veg' ? 'text-green-500' : ''} /> Veg
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFoodType("non veg")}
                                    className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border-2 ${foodType === 'non veg' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-gray-100 text-gray-400 hover:border-red-200'}`}
                                >
                                    <FaDrumstickBite className={foodType === 'non veg' ? 'text-red-500' : ''} /> Non-Veg
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        className='w-full bg-[#ff4d2d] text-white mt-10 px-6 py-5 rounded-[1.5rem] font-black text-lg shadow-[0_20px_40px_-10px_rgba(255,77,45,0.3)] hover:bg-orange-600 hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center' 
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={24} color='white' /> : "Update Dish Details"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditItem;