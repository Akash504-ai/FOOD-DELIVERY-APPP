import { useEffect, useState, useRef } from "react";
import { getRecommendations } from "../services/recommendationService";
import FoodCard from "./FoodCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function HomeRecommendations({ itemId }) {

  const [items, setItems] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {

    const fetchRecommendations = async () => {
      if (!itemId) return;

      const data = await getRecommendations(itemId);
      setItems(data);
    };

    fetchRecommendations();

  }, [itemId]);

  const scroll = (direction) => {

    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth"
    });

  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mb-24">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
          🔥 Recommended For You
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {items.map((item) => (
          <div
            key={item._id}
            className="min-w-[260px] flex-shrink-0 hover:scale-105 transition-transform duration-300"
          >
            <FoodCard data={item} />
          </div>
        ))}
      </div>

    </section>
  );
}

export default HomeRecommendations;