import React from 'react';

function CategoryCard({ name, image, onClick, active }) {
  return (
    <div 
      className={`relative w-[120px] h-[150px] md:w-[170px] md:h-[210px] flex-shrink-0 cursor-pointer transition-all duration-500 rounded-[2.5rem]
        ${active 
          ? 'scale-110 z-50 shadow-2xl' 
          : 'hover:scale-105 hover:-translate-y-2 z-10'
        }`}
      onClick={onClick}
    >
      {/* The visible card content */}
      <div className={`absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden border-4 transition-colors duration-500
        ${active ? 'border-[#ff4d2d]' : 'border-transparent'}`}>
        
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity 
          ${active ? 'opacity-100' : 'opacity-60'}`} 
        />

        <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-center justify-end">
          <span className="text-sm md:text-base font-bold text-white text-center">
            {name}
          </span>
          <div className={`h-1 bg-[#ff4d2d] rounded-full mt-1 transition-all duration-500 
            ${active ? 'w-10' : 'w-0'}`} 
          />
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;