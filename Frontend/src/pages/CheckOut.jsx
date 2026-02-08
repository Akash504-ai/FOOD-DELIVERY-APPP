import React, { useEffect, useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearchOutline, IoLocationSharp, IoShieldCheckmarkOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from '../redux/mapSlice';
import { MdDeliveryDining, MdOutlinePayment } from "react-icons/md";
import { FaCreditCard, FaArrowRight } from "react-icons/fa";
import axios from 'axios';
import { FaMobileScreenButton } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { addMyOrder } from '../redux/userSlice';

function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap();
    map.setView([location.lat, location.lon], 16, { animate: true });
  }
  return null;
}

function CheckOut() {
  const { location, address } = useSelector(state => state.map);
  const { cartItems, totalAmount, userData } = useSelector(state => state.user);
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const AmountWithDeliveryFee = totalAmount + deliveryFee;

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLng(lat, lng);
  };

  const getCurrentLocation = () => {
    const latitude = userData.location.coordinates[1];
    const longitude = userData.location.coordinates[0];
    dispatch(setLocation({ lat: latitude, lon: longitude }));
    getAddressByLatLng(latitude, longitude);
  };

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`);
      dispatch(setAddress(result?.data?.results[0].address_line2));
    } catch (error) {
      console.log(error);
    }
  };

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`);
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/place-order`, {
        paymentMethod,
        deliveryAddress: {
          text: addressInput,
          latitude: location.lat,
          longitude: location.lon
        },
        totalAmount: AmountWithDeliveryFee,
        cartItems
      }, { withCredentials: true });

      if (paymentMethod === "cod") {
        dispatch(addMyOrder(result.data));
        navigate("/order-placed");
      } else {
        const orderId = result.data.orderId;
        const razorOrder = result.data.razorOrder;
        openRazorpayWindow(orderId, razorOrder);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openRazorpayWindow = (orderId, razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: 'INR',
      name: "Vingo",
      description: "Food Delivery Website",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const result = await axios.post(`${serverUrl}/api/order/verify-payment`, {
            razorpay_payment_id: response.razorpay_payment_id,
            orderId
          }, { withCredentials: true });
          dispatch(addMyOrder(result.data));
          navigate("/order-placed");
        } catch (error) {
          console.log(error);
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

  return (
    <div className='min-h-screen bg-[#fffcfb] pb-20'>
      {/* --- HEADER --- */}
      <div className='w-full bg-white/80 backdrop-blur-md sticky top-0 z-[50] border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-6 h-[80px] flex items-center gap-4'>
          <button onClick={() => navigate("/cart")} className='p-2 hover:bg-gray-100 rounded-xl transition-colors text-[#ff4d2d]'>
            <IoIosArrowRoundBack size={35} />
          </button>
          <h1 className='text-2xl font-black text-gray-800 tracking-tighter'>Checkout</h1>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 mt-10'>
        <div className='flex flex-col lg:flex-row gap-10 items-start'>
          
          {/* --- LEFT: DETAILS --- */}
          <div className='w-full lg:w-2/3 space-y-8'>
            
            {/* Delivery Section */}
            <section className='bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='p-3 bg-orange-50 text-[#ff4d2d] rounded-2xl'>
                  <IoLocationSharp size={24} />
                </div>
                <h2 className='text-xl font-black text-gray-800 tracking-tight'>Delivery Location</h2>
              </div>

              <div className='flex gap-3 mb-6'>
                <div className='flex-1 relative'>
                  <input 
                    type="text" 
                    className='w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#ff4d2d]/20 focus:border-[#ff4d2d] outline-none transition-all' 
                    placeholder='Search for a location...' 
                    value={addressInput} 
                    onChange={(e) => setAddressInput(e.target.value)} 
                  />
                </div>
                <button className='bg-gray-900 text-white p-4 rounded-2xl hover:bg-black transition-all shadow-lg shadow-black/10' onClick={getLatLngByAddress}>
                  <IoSearchOutline size={20} />
                </button>
                <button className='bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200' onClick={getCurrentLocation}>
                  <TbCurrentLocation size={20} />
                </button>
              </div>

              <div className='rounded-[2rem] border-4 border-white shadow-xl overflow-hidden relative group'>
                <div className='h-[350px] w-full z-0'>
                  <MapContainer className="w-full h-full" center={[location?.lat, location?.lon]} zoom={16}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <RecenterMap location={location} />
                    <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />
                  </MapContainer>
                </div>
                <div className='absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-100 shadow-sm'>
                  <p className='text-[10px] font-black uppercase tracking-widest text-gray-400'>Drag marker to refine</p>
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className='bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100'>
              <div className='flex items-center gap-3 mb-8'>
                <div className='p-3 bg-orange-50 text-[#ff4d2d] rounded-2xl'>
                  <MdOutlinePayment size={24} />
                </div>
                <h2 className='text-xl font-black text-gray-800 tracking-tight'>Payment Method</h2>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div 
                  className={`group cursor-pointer flex items-center gap-4 rounded-[2rem] border-2 p-6 transition-all duration-300 ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50/50 shadow-md" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`} 
                  onClick={() => setPaymentMethod("cod")}
                >
                  <div className={`p-4 rounded-2xl transition-colors ${paymentMethod === "cod" ? "bg-[#ff4d2d] text-white" : "bg-gray-100 text-gray-400 group-hover:text-gray-600"}`}>
                    <MdDeliveryDining size={24} />
                  </div>
                  <div>
                    <p className='font-bold text-gray-800'>Cash on Delivery</p>
                    <p className='text-xs font-medium text-gray-400 uppercase tracking-tighter mt-0.5'>Pay at your doorstep</p>
                  </div>
                </div>

                <div 
                  className={`group cursor-pointer flex items-center gap-4 rounded-[2rem] border-2 p-6 transition-all duration-300 ${paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50/50 shadow-md" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`} 
                  onClick={() => setPaymentMethod("online")}
                >
                  <div className={`p-4 rounded-2xl transition-colors ${paymentMethod === "online" ? "bg-[#ff4d2d] text-white" : "bg-gray-100 text-gray-400 group-hover:text-gray-600"}`}>
                    <FaCreditCard size={24} />
                  </div>
                  <div>
                    <p className='font-bold text-gray-800'>Online Payment</p>
                    <p className='text-xs font-medium text-gray-400 uppercase tracking-tighter mt-0.5'>UPI, Cards or Netbanking</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* --- RIGHT: SUMMARY --- */}
          <div className='w-full lg:w-1/3 sticky top-[100px]'>
            <div className='bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 border border-gray-100'>
              <h2 className='text-xl font-black text-gray-800 mb-8 tracking-tight'>Order Summary</h2>
              
              <div className='max-h-[250px] overflow-y-auto pr-2 no-scrollbar mb-8 space-y-4'>
                {cartItems.map((item, index) => (
                  <div key={index} className='flex justify-between items-center text-sm'>
                    <div className='flex flex-col'>
                      <span className='font-bold text-gray-800 line-clamp-1'>{item.name}</span>
                      <span className='text-[10px] text-gray-400 font-bold'>QTY: {item.quantity}</span>
                    </div>
                    <span className='font-black text-gray-700'>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className='space-y-4 pt-6 border-t border-dashed border-gray-100'>
                <div className='flex justify-between text-sm font-bold text-gray-400 uppercase tracking-wider'>
                  <span>Subtotal</span>
                  <span className='text-gray-600 font-black'>₹{totalAmount}</span>
                </div>
                <div className='flex justify-between text-sm font-bold text-gray-400 uppercase tracking-wider'>
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-500 font-black' : 'text-gray-600 font-black'}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                
                <div className='h-px bg-gray-100 my-4' />
                
                <div className='flex justify-between items-center'>
                  <span className='text-lg font-black text-gray-800'>Total</span>
                  <span className='text-3xl font-black text-[#ff4d2d]'>₹{AmountWithDeliveryFee}</span>
                </div>
              </div>

              <button 
                className='w-full mt-10 bg-[#ff4d2d] text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group'
                onClick={handlePlaceOrder}
              >
                {paymentMethod === "cod" ? "Confirm Order" : "Secure Payment"}
                <FaArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
              </button>
              
              <div className='flex items-center justify-center gap-2 mt-6 text-emerald-500'>
                <IoShieldCheckmarkOutline size={16} />
                <span className='text-[10px] font-black uppercase tracking-widest'>Secure Transaction</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CheckOut;