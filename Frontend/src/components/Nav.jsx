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
import { socket } from "../socket"; // Ensure this is imported

function Nav() {
    const { userData, currentCity, cartItems } = useSelector(state => state.user);
    const { myShopData } = useSelector(state => state.owner);
    const [showInfo, setShowInfo] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState("");
    const [newOrderCount, setNewOrderCount] = useState(0); // State for live badge
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Socket listener for new orders (Owner only)
    useEffect(() => {
  if (!userData || userData.role !== "owner" || !myShopData?._id) return;

  const handleNewOrder = (order) => {
    // 🔒 Only count orders for THIS shop
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
        <nav className='w-full h-[98px] flex items-center justify-between px-6 md:px-12 fixed top-0 z-[9999] bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300'>
            
            {/* Logo Section */}
            <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate("/")}>
                <div className='w-10 h-10 bg-[#ff4d2d] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff4d2d]/30'>
                    <span className='text-white font-black text-xl'>V</span>
                </div>
                <h1 className='text-2xl font-black tracking-tight text-gray-800 hidden sm:block'>
                    Vingo<span className='text-[#ff4d2d]'>.</span>
                </h1>
            </div>

            {/* Desktop Search Bar */}
            {userData?.role === "user" && (
                <div className='hidden md:flex items-center bg-gray-100/80 px-4 py-2.5 rounded-2xl w-full max-w-[450px] border border-transparent focus-within:border-[#ff4d2d]/30 focus-within:bg-white focus-within:shadow-sm transition-all'>
                    <div className='flex items-center gap-2 border-r border-gray-300 pr-3 min-w-[120px] max-w-[150px]'>
                        <FaLocationDot className="text-[#ff4d2d]" size={18} />
                        <span className='text-sm font-medium text-gray-500 truncate'>{currentCity || "Select Location"}</span>
                    </div>
                    <div className='flex items-center gap-2 pl-3 w-full'>
                        <IoIosSearch size={20} className='text-gray-400' />
                        <input 
                            type="text" 
                            placeholder='Search delicious food...' 
                            className='bg-transparent text-sm text-gray-700 outline-none w-full' 
                            onChange={(e) => setQuery(e.target.value)} 
                            value={query}
                        />
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className='flex items-center gap-3 md:gap-6'>
                
                {/* Mobile Search Toggle */}
                {userData?.role === "user" && (
                    <button onClick={() => setShowSearch(!showSearch)} className='md:hidden p-2 text-gray-600 hover:text-[#ff4d2d] transition-colors'>
                        {showSearch ? <RxCross2 size={24} /> : <IoIosSearch size={24} />}
                    </button>
                )}

                {userData?.role === "owner" ? (
                    <div className='flex items-center gap-3'>
                        {myShopData && (
                            <button 
                                className='flex items-center gap-2 px-4 py-2 bg-[#ff4d2d] text-white rounded-xl shadow-md shadow-[#ff4d2d]/20 hover:scale-105 transition-transform font-medium text-sm'
                                onClick={() => navigate("/add-item")}
                            >
                                <FaPlus />
                                <span className='hidden sm:block'>Add Item</span>
                            </button>
                        )}
                        
                        {/* Live Updating Order Icon */}
                        <div className='relative group'>
                            <button 
                                className={`p-2.5 rounded-xl transition-all duration-300 ${newOrderCount > 0 ? 'bg-[#ff4d2d] text-white shadow-lg shadow-[#ff4d2d]/30 animate-pulse' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                onClick={() => {
                                    setNewOrderCount(0); // Reset badge when viewing orders
                                    navigate("/my-orders");
                                }}
                                title="My Orders"
                            >
                                <TbReceipt2 size={22} />
                            </button>
                            {newOrderCount > 0 && (
                                <span className='absolute -top-2 -right-2 bg-black text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm'>
                                    {newOrderCount > 9 ? '9+' : newOrderCount}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {userData?.role === "user" && (
                            <div className='relative cursor-pointer group' onClick={() => navigate("/cart")}>
                                <div className='p-2.5 bg-gray-100 rounded-xl group-hover:bg-[#ff4d2d]/10 group-hover:text-[#ff4d2d] transition-all'>
                                    <FiShoppingCart size={22} />
                                </div>
                                {cartItems?.length > 0 && (
                                    <span className='absolute -top-1 -right-1 bg-[#ff4d2d] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white'>
                                        {cartItems.length}
                                    </span>
                                )}
                            </div>
                        )}
                        <button 
                            className='hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 font-semibold hover:text-[#ff4d2d] transition-colors text-sm'
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
                        className='w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff4d2d] to-[#ff785d] flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:rotate-3 transition-transform'
                        onClick={() => setShowInfo(!showInfo)}
                    >
                        {userData?.fullName?.slice(0, 1).toUpperCase()}
                    </div>

                    {showInfo && (
                        <div className='absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-in fade-in zoom-in duration-200'>
                            <div className='px-4 py-3 border-b border-gray-50 mb-1'>
                                <p className='text-xs text-gray-400 font-medium uppercase tracking-wider'>Account</p>
                                <p className='text-sm font-bold text-gray-800 truncate'>{userData?.fullName}</p>
                            </div>
                            
                            {(userData?.role === "user" || userData?.role === "owner") && (
                                <div 
                                    className='flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer md:hidden' 
                                    onClick={() => navigate("/my-orders")}
                                >
                                    <TbReceipt2 size={18} /> My Orders
                                </div>
                            )}

                            <div 
                                className='flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors'
                                onClick={handleLogOut}
                            >
                                <FiLogOut size={18} /> Log Out
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {showSearch && userData?.role === "user" && (
                <div className='absolute top-[80px] left-0 w-full p-4 bg-white border-b border-gray-100 flex md:hidden animate-in slide-in-from-top duration-300'>
                    <div className='flex items-center bg-gray-100 px-4 py-3 rounded-xl w-full gap-3'>
                        <IoIosSearch size={22} className='text-[#ff4d2d]' />
                        <input 
                            autoFocus
                            type="text" 
                            placeholder='Search delicious food...' 
                            className='bg-transparent text-sm text-gray-700 outline-none w-full' 
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