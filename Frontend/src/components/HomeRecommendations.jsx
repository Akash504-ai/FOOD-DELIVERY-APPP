import { useEffect, useState, useRef } from "react";
import { getRecommendations } from "../services/recommendationService";
import FoodCard from "./FoodCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { FaFire } from "react-icons/fa6";

function HomeRecommendations({ itemId }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!itemId) return;
      setIsLoading(true);
      try {
        const data = await getRecommendations(itemId);
        setItems(data);
      } catch (error) {
        console.error("Failed to load recommendations", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, [itemId]);

  const checkScrollLimits = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -450 : 450;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FaFire className="text-orange-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Recommended for you
            </h2>
          </div>
          <p className="text-gray-500 text-sm md:text-base">
            Based on your recent favorites
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-3 rounded-full bg-white border border-gray-100 shadow-sm transition-all duration-200 
              ${!canScrollLeft ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 hover:shadow-md active:scale-90"}`}
          >
            <FaChevronLeft className="text-gray-700" size={18} />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-3 rounded-full bg-white border border-gray-100 shadow-sm transition-all duration-200 
              ${!canScrollRight ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 hover:shadow-md active:scale-90"}`}
          >
            <FaChevronRight className="text-gray-700" size={18} />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div
        ref={scrollRef}
        onScroll={checkScrollLimits}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {isLoading
          ? // Skeleton Loading State
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="min-w-[280px] h-[350px] bg-gray-100 animate-pulse rounded-3xl"
              />
            ))
          : items.map((item) => (
              <div
                key={item._id}
                className="min-w-[280px] md:min-w-[320px] flex-shrink-0 snap-start transition-all duration-500 hover:-translate-y-2"
              >
                <FoodCard data={item} />
              </div>
            ))}
        {/* Invisible spacer for perfect end-of-list padding */}
        <div className="min-w-[20px] flex-shrink-0" />
      </div>
    </section>
  );
}

export default HomeRecommendations;
