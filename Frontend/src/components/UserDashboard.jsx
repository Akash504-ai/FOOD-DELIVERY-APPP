import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav.jsx";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/moving-border";
import Footer from "./Footer";
import { motion } from "framer-motion";
import HomeRecommendations from "./HomeRecommendations.jsx";
import { Tooltip } from "../components/ui/tooltip-card"; // Adjust path as needed

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
  const duplicatedCategories = [...categories, ...categories];
  // 1. At the top of your component, add this state:
  const [visibleCount, setVisibleCount] = useState(8);

  // 2. Add a function to handle loading more:
  const loadMoreItems = () => {
    setVisibleCount((prevCount) => prevCount + 8); // Increase by 8 each time
  };

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

    const cateRef = cateScrollRef.current;
    const shopRef = shopScrollRef.current;

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
    // FIX: Reduced pt-[90px] to pt-[70px] to tighten the gap with Nav
    <div className="w-full min-h-screen bg-[#fffdfc] pt-[70px] overflow-x-hidden flex flex-col">
      <Nav />

      {/* --- SEARCH RESULTS SECTION --- */}
      {/* If searchItems exists, this will pop up at the top immediately under Nav */}
      {searchItems && searchItems.length > 0 && (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 mt-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-500 z-20">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl shadow-orange-100/40 border border-orange-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-[#ff4d2d] rounded-full" />
              <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
                Search Results{" "}
                <span className="text-gray-400 font-medium text-lg ml-2">
                  ({searchItems.length})
                </span>
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
              {searchItems.map((item) => (
                <FoodCard data={item} key={item._id} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- PREMIUM HERO SECTION --- */}
      {/* FIX: Optimized the negative margin to prevent that huge empty space in your screenshot */}
      <section
        className={`max-w-7xl mx-auto w-full px-4 md:px-6 mb-16 mt-[-70px] transition-all duration-500 ${searchItems ? "mt-4" : "mt-0 md:mt-[-70px]"}`}
      >
        <div className="relative w-full bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 border border-gray-100 shadow-2xl shadow-orange-50/50 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-50 rounded-full blur-[100px] -mr-20 -mt-20 opacity-60" />

          <div className="flex-1 space-y-6 relative z-10 text-center md:text-left flex flex-col items-center md:items-start">
            <Button
              borderRadius="1.75rem"
              duration={3500}
              containerClassName="w-fit h-auto p-[1.5px]"
              borderClassName="bg-[radial-gradient(#ff4d2d_30%,#ff4d2d80_55%,transparent_70%)]"
              className="bg-white/90 backdrop-blur-md text-gray-900 font-black px-6 py-3 border-none flex items-center gap-2 shadow-sm"
            >
              <span className="animate-bounce">🚀</span>
              <span className="tracking-tighter text-sm md:text-base">
                The Best Food <span className="text-[#ff4d2d]">Delivery</span>{" "}
                Experience
              </span>
            </Button>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1] tracking-tighter">
              Craving something <br />
              <span className="text-[#ff4d2d]">Delicious?</span>
            </h1>

            <p className="text-gray-500 text-base md:text-lg max-w-md font-medium">
              Explore thousands of flavors from top-rated restaurants in{" "}
              <Tooltip
                content={`Showing restaurants available in ${currentCity || "your area"}`}
              >
                <span className="text-gray-900 underline decoration-orange-300 decoration-2 underline-offset-4 cursor-help">
                  {currentCity || "your area"}
                </span>
              </Tooltip>{" "}
              delivered home.
            </p>

            <Tooltip
              content={
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                    className="w-10 h-10 rounded object-cover"
                  />
                  <span>Start ordering delicious food</span>
                </div>
              }
            >
              <button
                onClick={() =>
                  shopScrollRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-10 py-5 bg-[#ff4d2d] text-white rounded-2xl font-black shadow-xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                Order Now <FaArrowRight />
              </button>
            </Tooltip>
          </div>

          <div className="flex-1 relative w-full flex justify-center">
            <div className="w-full max-w-[450px] md:max-w-none relative animate-float">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000"
                alt="Food"
                className="rounded-[3rem] md:rounded-[4rem] shadow-2xl rotate-2 md:rotate-3 border-[10px] md:border-[16px] border-white w-full object-cover"
              />
              <div className="absolute -bottom-6 -right-2 md:right-4 bg-white p-4 rounded-3xl shadow-2xl flex items-center gap-2 border border-gray-50 scale-90 md:scale-100">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-black text-xs text-gray-800 tracking-tight">
                  FAST DELIVERY
                </span>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl animate-bounce">
                <span className="text-2xl">🍕</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16 overflow-hidden">
        <h2 className="text-2xl md:text-3xl font-[1000] text-gray-900 mb-8 tracking-tighter">
          Inspiration for your{" "}
          <span className="text-[#ff4d2d]">first order</span>
        </h2>

        <div className="relative group p-6 bg-orange-50/30 rounded-[3.5rem] border border-orange-100/50 shadow-inner overflow-hidden">
          {/* Subtle Gradient Overlays for the "Fade" look at edges */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-orange-50/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-orange-50/50 to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-8 py-4 items-center cursor-grab active:cursor-grabbing"
            animate={{
              x: ["0%", "-50%"], // Moves halfway because the list is duplicated
            }}
            transition={{
              duration: 25, // Adjust for speed
              ease: "linear",
              repeat: Infinity,
            }}
            /* Pause the animation on hover so user can click */
            whileHover={{ animationPlayState: "paused" }}
          >
            {duplicatedCategories.map((cate, index) => (
              <div key={index} className="flex-shrink-0">
                <Tooltip
                  content={
                    <div className="flex items-center gap-3">
                      <img
                        src={cate.image}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <span className="font-semibold">{cate.category}</span>
                    </div>
                  }
                >
                  <div>
                    <CategoryCard
                      name={cate.category}
                      image={cate.image}
                      active={activeCategory === cate.category}
                      onClick={() => handleFilterByCategory(cate.category)}
                    />
                  </div>
                </Tooltip>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- BEST SHOPS SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
        <div className="bg-gray-50/50 rounded-[4rem] border border-gray-100 p-8 md:p-12 shadow-inner">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
              Best Shops in{" "}
              <span className="text-[#ff4d2d]">{currentCity || "Kolkata"}</span>
            </h2>
            <div className="h-1 w-20 bg-orange-200 rounded-full hidden md:block" />
          </div>

          <div
            className="flex overflow-x-auto gap-8 py-4 no-scrollbar scroll-smooth"
            ref={shopScrollRef}
          >
            {shopInMyCity?.map((shop, index) => (
              <Tooltip
                key={index}
                content={
                  <div className="flex items-center gap-3">
                    <img
                      src={shop.image}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <span className="font-semibold">{shop.name}</span>
                  </div>
                }
              >
                <div
                  className="min-w-[180px] md:min-w-[240px] flex-shrink-0 cursor-pointer hover:-translate-y-4 transition-all duration-500"
                  onClick={() => navigate(`/shop/${shop._id}`)}
                >
                  <div className="bg-white p-2 rounded-[2.5rem] shadow-lg border border-orange-50">
                    <CategoryCard name={shop.name} image={shop.image} />
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </section>

      {/* posted here */}

      <HomeRecommendations itemId="69863900b4b3a91c291be101" />

      {/* --- CURATED ITEMS --- */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-24">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight shrink-0">
            Curated <span className="text-[#ff4d2d]">Selection</span>
          </h2>
          <div className="h-[2px] w-full bg-gradient-to-r from-orange-100 to-transparent" />
        </div>

        {/* Slice the list to show only the visibleCount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {updatedItemsList?.slice(0, visibleCount).map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              key={index}
              className="hover:scale-105 transition-transform duration-300"
            >
              <FoodCard data={item} />
            </motion.div>
          ))}
        </div>

        {/* --- SEE MORE BUTTON --- */}
        {updatedItemsList && visibleCount < updatedItemsList.length && (
          <div className="flex justify-center mt-16">
            <button
              onClick={loadMoreItems}
              className="group relative px-8 py-3 bg-white border-2 border-[#ff4d2d] text-[#ff4d2d] font-bold rounded-2xl hover:bg-[#ff4d2d] hover:text-white transition-all duration-300 shadow-lg shadow-orange-100 flex items-center gap-2"
            >
              See More Delicious Bites
              <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default UserDashboard;
