import React, { useEffect, useRef, useState } from "react";
import Nav from "./NaV.JSX";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/moving-border"; // Import Aceternity component
import Footer from "./Footer";

function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector(
    (state) => state.user,
  );
  const cateScrollRef = useRef();
  const shopScrollRef = useRef();
  const navigate = useNavigate();

  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const handleFilterByCategory = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      const filteredList = itemsInMyCity?.filter(
        (i) => i.category === category,
      );
      setUpdatedItemsList(filteredList);
    }
  };

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity);
  }, [itemsInMyCity]);

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      setLeftButton(element.scrollLeft > 10);
      setRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth - 10,
      );
    }
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const cateRef = cateScrollRef.current;
    const shopRef = shopScrollRef.current;

    const handleScroll = () => {
      updateButton(
        cateScrollRef,
        setShowLeftCateButton,
        setShowRightCateButton,
      );
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton,
      );
    };

    if (cateRef && shopRef) {
      handleScroll();
      cateRef.addEventListener("scroll", handleScroll);
      shopRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      cateRef?.removeEventListener("scroll", handleScroll);
      shopRef?.removeEventListener("scroll", handleScroll);
    };
  }, [categories, shopInMyCity]);

  return (
    <div className="w-full min-h-screen bg-[#fffcfb] pt-[80px] overflow-x-hidden flex flex-col">
      <Nav />

      {/* --- PREMIUM HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 mb-16 my-[-60px]">
        <div className="relative w-full bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-2xl shadow-orange-100/20 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden">
          {/* Background Decorative Blur */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-100/50 rounded-full blur-[100px] -mr-20 -mt-20" />

          <div className="flex-1 space-y-6 relative z-10">
            {/* ACETERNITY MOVING BORDER BADGE */}
            <Button
              borderRadius="1.75rem"
              duration={3500}
              containerClassName="w-fit h-auto p-[2px] transition-transform duration-300 hover:scale-105"
              borderClassName="opacity-[0.9] bg-[radial-gradient(#ff4d2d_40%,transparent_60%)]"
              className="bg-white/95 backdrop-blur-md text-gray-900 font-black px-8 py-4 border-none flex items-center gap-3 shadow-sm"
            >
              <span className="text-xl animate-bounce">🚀</span>
              <span className="tracking-tighter whitespace-nowrap text-base md:text-lg">
                The Best Food <span className="text-[#ff4d2d]">Delivery</span>{" "}
                Experience
              </span>
            </Button>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tighter">
              Craving something <br />
              <span className="text-[#ff4d2d]">Delicious?</span>
            </h1>

            <p className="text-gray-500 text-lg max-w-md font-medium">
              Explore thousands of flavors from top-rated restaurants in{" "}
              {currentCity || "your area"} delivered right to your doorstep.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() =>
                  shopScrollRef.current.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-[#ff4d2d] text-white rounded-2xl font-black shadow-lg shadow-orange-200 hover:scale-105 transition-all flex items-center gap-2"
              >
                Order Now <FaArrowRight />
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="w-full h-full relative z-10 animate-float">
              {/* Floating Food Highlight - Use your main brand image here */}
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000"
                alt="Delicious Food"
                className="rounded-[2.5rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border-8 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- SEARCH RESULTS SECTION --- */}
      {searchItems && (
        <div className="max-w-7xl mx-auto px-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-[#ff4d2d] rounded-full" />
              <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
                Search Results{" "}
                <span className="text-gray-400 font-medium text-lg ml-2">
                  ({searchItems.length})
                </span>
              </h1>
            </div>

            {searchItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                {searchItems.map((item) => (
                  <FoodCard data={item} key={item._id} />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-gray-400 font-medium">
                No items found for your search.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CATEGORIES SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-6 tracking-tight">
          Inspiration for your{" "}
          <span className="text-[#ff4d2d]">first order</span>
        </h2>

        <div className="relative group">
          {showLeftCateButton && (
            <button
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white text-[#ff4d2d] rounded-full shadow-xl border border-gray-100 hover:scale-110 transition-all z-[30]"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaChevronLeft size={18} />
            </button>
          )}

          <div
            className="flex overflow-x-auto overflow-y-visible gap-6 py-10 px-4 no-scrollbar select-none scroll-smooth"
            ref={cateScrollRef}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cate, index) => (
              <CategoryCard
                key={index}
                name={cate.category}
                image={cate.image}
                active={activeCategory === cate.category}
                onClick={() => handleFilterByCategory(cate.category)}
              />
            ))}
          </div>

          {showRightCateButton && (
            <button
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white text-[#ff4d2d] rounded-full shadow-xl border border-gray-100 hover:scale-110 transition-all z-[30]"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaChevronRight size={18} />
            </button>
          )}
        </div>
      </section>

      {/* --- BEST SHOPS SECTION --- */}
      <section className="w-305 mx-auto px-6 mb-16 py-12 bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-orange-100/10 overflow-visible">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 px-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-[#ff4d2d] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff4d2d]">
                Elite Selection
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
              Best Shops in{" "}
              <span className="text-[#ff4d2d]">{currentCity || "Kolkata"}</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm font-medium max-w-[200px] leading-tight hidden lg:block">
            Handpicked restaurants with the highest safety and quality
            standards.
          </p>
        </div>

        <div className="relative group px-4">
          {/* Left Scroll Button */}
          {showLeftShopButton && (
            <button
              className="absolute -left-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white text-[#ff4d2d] rounded-2xl shadow-xl z-[40] border border-gray-50 hover:bg-[#ff4d2d] hover:text-white transition-all duration-300"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaChevronLeft size={20} />
            </button>
          )}

          {/* The Scroll Container with horizontal padding to prevent clipping */}
          <div
            className="flex overflow-x-auto overflow-y-visible gap-8 py-8 px-4 no-scrollbar scroll-smooth items-center"
            ref={shopScrollRef}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {shopInMyCity?.length > 0 ? (
              shopInMyCity.map((shop, index) => (
                <div
                  key={index}
                  className="group/shop relative min-w-[150px] md:min-w-[200px] flex-shrink-0"
                  onClick={() => navigate(`/shop/${shop._id}`)}
                >
                  {/* Hover Indicator Badge */}
                  <div className="absolute -top-2 -right-2 bg-[#ff4d2d] text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover/shop:opacity-100 transition-all duration-300 z-20 shadow-lg translate-y-2 group-hover/shop:translate-y-0">
                    OPEN
                  </div>

                  <div className="hover:scale-105 hover:-translate-y-3 transition-all duration-500">
                    <CategoryCard name={shop.name} image={shop.image} />
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full flex flex-col items-center py-10 opacity-40">
                <div className="w-16 h-1 bg-gray-200 rounded-full animate-pulse mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                  Discovering Local Favorites...
                </p>
              </div>
            )}
          </div>

          {/* Right Scroll Button */}
          {showRightShopButton && (
            <button
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white text-[#ff4d2d] rounded-2xl shadow-xl z-[40] border border-gray-50 hover:bg-[#ff4d2d] hover:text-white transition-all duration-300"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaChevronRight size={20} />
            </button>
          )}
        </div>
      </section>

      {/* --- SUGGESTED FOOD ITEMS --- */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
            Curated <span className="text-[#ff4d2d]">Selection</span>
          </h2>
          <div className="h-[2px] flex-grow bg-gradient-to-r from-gray-100 to-transparent mx-6 hidden sm:block"></div>
          <button className="text-sm font-black text-orange-500 uppercase tracking-widest hover:text-orange-600 transition-colors">
            Explore All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 justify-items-center">
          {updatedItemsList?.map((item, index) => (
            <div
              key={index}
              className="animate-in fade-in zoom-in duration-700"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <FoodCard data={item} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default UserDashboard;
