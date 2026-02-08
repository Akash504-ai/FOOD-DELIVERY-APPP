import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaStore,
  FaLocationDot,
  FaUtensils,
  FaArrowLeft,
  FaStar,
  FaClock,
  FaFire,
} from "react-icons/fa6";
import FoodCard from "../components/FoodCard";
import Footer from "../components/Footer";

function Shop() {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleShop = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${serverUrl}/api/item/get-by-shop/${shopId}`,
        { withCredentials: true },
      );

      // Log this to your browser console to see what the API returns
      console.log("API Response:", result.data);

      if (result.data) {
        setShop(result.data.shop);
        // Ensure items is always an array
        setItems(result.data.items || []);
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleShop();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [shopId]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#fffcfb]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-100 border-t-[#ff4d2d] rounded-full animate-spin" />
          <FaUtensils className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ff4d2d] animate-pulse" />
        </div>
        <p className="mt-4 font-black text-gray-400 uppercase tracking-widest text-xs">
          Loading Flavors
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#fffcfb] flex flex-col selection:bg-[#ff4d2d] selection:text-white">
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-4 pointer-events-none">
        <button
          className="pointer-events-auto flex items-center gap-3 bg-white/90 backdrop-blur-xl hover:bg-[#ff4d2d] hover:text-white text-gray-900 px-6 py-3 rounded-2xl shadow-2xl shadow-black/5 transition-all duration-500 group border border-white/50"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-tight">
            Back to Explore
          </span>
        </button>
      </nav>

      {/* --- HERO HEADER SECTION --- */}
      <div className="w-full relative min-h-[50vh] md:min-h-[65vh] overflow-hidden bg-gray-900">
        {shop && (
          <>
            <img
              src={shop.image}
              alt={shop.name}
              className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#fffcfb]" />

            <div className="absolute bottom-0 w-full z-10">
              <div className="max-w-6xl mx-auto px-6">
                <div className="bg-white rounded-t-[3rem] md:rounded-t-[4rem] p-10 md:p-16 shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.1)] flex flex-col items-center text-center relative border-x border-t border-gray-50">
                  <div className="absolute -top-12 md:-top-16 bg-[#ff4d2d] p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-[#ff4d2d]/30 border-[8px] border-white transition-transform hover:scale-110 duration-500">
                    <FaStore className="text-white text-3xl md:text-5xl" />
                  </div>

                  <div className="mt-8 md:mt-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="h-[1px] w-8 bg-gray-200"></span>
                      <span className="text-[#ff4d2d] font-bold text-xs uppercase tracking-[0.4em]">
                        Premium Partner
                      </span>
                      <span className="h-[1px] w-8 bg-gray-200"></span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tight leading-none">
                      {shop.name}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-10">
                    <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <FaLocationDot className="text-[#ff4d2d]" size={16} />
                      <span className="text-sm font-bold text-gray-600">
                        {shop.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 bg-orange-50 rounded-2xl border border-orange-100">
                      <FaStar className="text-orange-500" size={16} />
                      <span className="text-sm font-black text-orange-800">
                        4.9 · Highly Rated
                      </span>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-sm font-black text-emerald-800 uppercase tracking-widest">
                        Open Now
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- MENU SECTION --- */}
      <main className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="relative flex flex-col items-center mb-24">
          <div className="flex items-center gap-3 px-5 py-2 bg-white shadow-xl shadow-black/[0.02] border border-gray-100 rounded-full mb-8">
            <FaFire className="text-[#ff4d2d]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
              Culinarily Crafted
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter text-center max-w-2xl leading-[1.1]">
            Discover the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d2d] to-[#ff8c2d]">
              Signature
            </span>{" "}
            Experience
          </h2>

          <div className="w-16 h-1.5 bg-[#ff4d2d] rounded-full mt-8 animate-bounce-slow" />
        </div>

        {/* --- THE GRID --- */}
        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 justify-items-center">
            {items.map((item, index) => (
              <div
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <FoodCard data={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-40">
            <div className="relative w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-dashed border-gray-200">
              <FaUtensils size={48} className="text-gray-200" />
            </div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-[0.4em]">
              The kitchen is warming up
            </p>
            <h3 className="text-2xl font-bold text-gray-300 mt-2">
              Menu Coming Soon
            </h3>
          </div>
        )}
      </main>

      <Footer />

      <style
        dangerouslySetInnerHTML={{
          __html: `
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slow-zoom {
                    from { transform: scale(1); }
                    to { transform: scale(1.1); }
                }
                .animate-slide-up {
                    animation: slide-up 0.8s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .animate-slow-zoom {
                    animation: slow-zoom 20s linear infinite alternate;
                }
                .animate-bounce-slow {
                    animation: bounce 3s infinite;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `,
        }}
      />
    </div>
  );
}

export default Shop;
