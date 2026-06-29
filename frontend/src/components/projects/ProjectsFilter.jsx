import React from 'react';

const ProjectsFilter = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory 
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center md:justify-around gap-4 mb-16">
      {categories.map((cat) => {
        const isActive = selectedCategory.toUpperCase() === cat.toUpperCase();
        return (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 shrink-0 rounded-none cursor-pointer ${
              isActive 
                ? 'bg-black text-white' 
                : 'bg-[#F7F7F7] hover:bg-[#EEEEEE] text-black'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default ProjectsFilter;