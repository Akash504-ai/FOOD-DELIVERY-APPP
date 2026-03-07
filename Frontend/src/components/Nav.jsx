import React, { useEffect, useState } from 'react';
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart, FiLogOut, FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { serverUrl } from '../App';
import { setSearchItems, setUserData } from '../redux/userSlice';
import { TbReceipt2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { socket } from "../socket";

function Nav() {
    const { userData, currentCity, cartItems } = useSelector(state => state.user);
    const { myShopData } = useSelector(state => state.owner);
    const [showInfo, setShowInfo] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState("");
    const [newOrderCount, setNewOrderCount] = useState(0); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData || userData.role !== "owner" || !myShopData?._id) return;

        const handleNewOrder = (order) => {
            if (order.shopId === myShopData._id) {
                setNewOrderCount((prev) => prev + 1);
            }
        };

        socket.on("newOrderIncoming", handleNewOrder);
        return () => {
            socket.off("newOrderIncoming", handleNewOrder);
        };
    }, [userData?.role, myShopData?._id]);

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
            dispatch(setUserData(null));
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchItems = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`, { withCredentials: true });
            dispatch(setSearchItems(result.data));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (query) {
            handleSearchItems();
        } else {
            dispatch(setSearchItems(null));
        }
    }, [query]);

    return (
        /* STEP 5: Navbar border updated to border-gray-300 for a sharper edge */
        <nav className='w-full h-[98px] flex items-center justify-between px-6 md:px-12 fixed top-0 z-[9999] bg-white/90 backdrop-blur-xl border-b border-gray-300 transition-all duration-300'>
            
            {/* Logo Section */}
            <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate("/")}>
                <div className='w-11 h-11 bg-[#ff4d2d] rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(255,77,45,0.3)]'>
                    <span className='text-white font-black text-2xl'>V</span>
                </div>
                <h1 className='text-2xl font-black tracking-tight text-gray-900 hidden sm:block'>
                    Vingo<span className='text-[#ff4d2d]'>.</span>
                </h1>
            </div>

            {/* Desktop Search Bar */}
            {userData?.role === "user" && (
                /* STEP 3: Search container set to bg-gray-50 */
                <div className='hidden md:flex items-center bg-gray-50 px-5 py-3 rounded-2xl w-full max-w-[480px] border border-gray-300 focus-within:border-[#ff4d2d] focus-within:bg-white focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all'>
                    <div className='flex items-center gap-2 border-r border-gray-300 pr-4 min-w-[130px] max-w-[160px]'>
                        <FaLocationDot className="text-[#ff4d2d]" size={16} />
                        <span className='text-xs font-bold text-gray-700 truncate uppercase tracking-tight'>{currentCity || "Location"}</span>
                    </div>
                    <div className='flex items-center gap-3 pl-4 w-full'>
                        <IoIosSearch size={22} className='text-gray-400' />
                        <input 
                            type="text" 
                            placeholder='Search delicious food...' 
                            className='bg-transparent text-sm text-gray-800 font-medium outline-none w-full placeholder:text-gray-400' 
                            onChange={(e) => setQuery(e.target.value)} 
                            value={query}
                        />
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className='flex items-center gap-3 md:gap-5'>
                
                {userData?.role === "user" && (
                    <button onClick={() => setShowSearch(!showSearch)} className='md:hidden p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 hover:text-[#ff4d2d] transition-colors'>
                        {showSearch ? <RxCross2 size={24} /> : <IoIosSearch size={24} />}
                    </button>
                )}

                {userData?.role === "owner" ? (
                    <div className='flex items-center gap-3'>
                        {myShopData && (
                            <button 
                                className='flex items-center gap-2 px-5 py-3 bg-[#ff4d2d] text-white rounded-xl shadow-[0_10px_20px_rgba(255,77,45,0.2)] hover:shadow-[0_15px_30px_rgba(255,77,45,0.3)] hover:-translate-y-0.5 transition-all font-bold text-sm'
                                onClick={() => navigate("/add-item")}
                            >
                                <FaPlus />
                                <span className='hidden sm:block'>Add Item</span>
                            </button>
                        )}
                        
                        <div className='relative'>
                            <button 
                                className={`p-3 rounded-xl border transition-all duration-300 ${newOrderCount > 0 ? 'bg-[#ff4d2d] border-[#ff4d2d] text-white shadow-lg shadow-[#ff4d2d]/30 animate-pulse' : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-white hover:shadow-sm'}`}
                                onClick={() => {
                                    setNewOrderCount(0);
                                    navigate("/my-orders");
                                }}
                            >
                                <TbReceipt2 size={22} />
                            </button>
                            {newOrderCount > 0 && (
                                <span className='absolute -top-2 -right-2 bg-black text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white'>
                                    {newOrderCount > 9 ? '9+' : newOrderCount}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {userData?.role === "user" && (
                            <div className='relative cursor-pointer group' onClick={() => navigate("/cart")}>
                                <div className='p-3 bg-gray-50 border border-gray-300 rounded-xl group-hover:bg-[#ff4d2d] group-hover:border-[#ff4d2d] group-hover:text-white transition-all'>
                                    <FiShoppingCart size={22} />
                                </div>
                                {cartItems?.length > 0 && (
                                    <span className='absolute -top-1.5 -right-1.5 bg-[#ff4d2d] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm'>
                                        {cartItems.length}
                                    </span>
                                )}
                            </div>
                        )}
                        <button 
                            className='hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 font-bold hover:text-[#ff4d2d] transition-colors text-sm'
                            onClick={() => navigate("/my-orders")}
                        >
                            <FiShoppingBag />
                            Orders
                        </button>
                    </>
                )}

                {/* Profile Section */}
                <div className='relative'>
                    <div 
                        className='w-11 h-11 rounded-2xl bg-gray-900 flex items-center justify-center text-white font-black shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all border border-gray-700'
                        onClick={() => setShowInfo(!showInfo)}
                    >
                        {userData?.fullName?.slice(0, 1).toUpperCase()}
                    </div>

                    {showInfo && (
                        /* STEP 2: Profile Dropdown border updated to border-gray-300 */
                        <div className='absolute top-16 right-0 w-64 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-300 p-2 animate-in fade-in zoom-in duration-200'>
                            <div className='px-4 py-4 border-b border-gray-300 mb-1'>
                                <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1'>Authenticated As</p>
                                <p className='text-sm font-black text-gray-900 truncate'>{userData?.fullName}</p>
                            </div>
                            
                            <div 
                                className='flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl cursor-pointer transition-colors' 
                                onClick={() => navigate("/my-orders")}
                            >
                                <TbReceipt2 size={20} className="text-gray-400" /> Activity History
                            </div>

                            <div 
                                className='flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-colors'
                                onClick={handleLogOut}
                            >
                                <FiLogOut size={20} /> Terminate Session
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {showSearch && userData?.role === "user" && (
                <div className='absolute top-[98px] left-0 w-full p-4 bg-white border-b border-gray-300 flex md:hidden animate-in slide-in-from-top duration-300'>
                    <div className='flex items-center bg-gray-50 border border-gray-300 px-4 py-3 rounded-xl w-full gap-3'>
                        <IoIosSearch size={22} className='text-[#ff4d2d]' />
                        <input 
                            autoFocus
                            type="text" 
                            placeholder='Search delicious food...' 
                            className='bg-transparent text-sm text-gray-800 font-bold outline-none w-full' 
                            onChange={(e) => setQuery(e.target.value)} 
                            value={query}
                        />
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Nav;