import React from 'react';

const NcProjectsSectionHeader = ({
  title = "OUR PROJECTS",
  subHeadline = "It is a long established fact that a reader will be distracted.\nAt Naturecube, we take students from schools and colleges on extensive field tours to natural surroundings\nand nature reserves,",
  description = "At Naturecube, we take students from schools and colleges on extensive field tours to natural surroundings and nature reserves, teaching them about nature, conservation, and ecosystem functions. Using both outdoor environments and our gallery’s aquariums and terrariums as models.",
  categories = ['ALL', 'HOME', 'OFFICE', 'COMMERCIAL SPACE', 'OTHERS'],
  selectedCategory = 'OFFICE',
  onSelectCategory
}) => {
  return (
    <section className="w-full bg-white pt-10 sm:pt-16 md:pt-24 pb-8 sm:pb-12 px-4 sm:px-8 md:px-16 font-kanit">
      <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 md:space-y-9">

        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-black tracking-wider uppercase leading-tight font-reem">
          {title}
        </h2>

        {subHeadline && (
          <div className="text-base sm:text-xl md:text-2xl font-semibold text-zinc-600 leading-snug sm:leading-normal max-w-3xl mx-auto font-kanit whitespace-pre-line">
            {subHeadline}
          </div>
        )}

        {description && (
          <p className="text-xs sm:text-base md:text-lg font-normal text-zinc-500 leading-relaxed max-w-3xl mx-auto font-kanit">
            {description}
          </p>
        )}

        <div className="pt-4 sm:pt-8 max-w-3xl mx-auto">
          <div className="border-y border-[#C5DCAC] py-2.5 sm:py-4 flex flex-wrap items-center justify-center gap-2 sm:gap-6 md:gap-8 font-kanit">
            {categories.map((cat, index) => {
              const isActive = (selectedCategory || '').toUpperCase() === cat.toUpperCase();
              return (
                <React.Fragment key={cat}>
                  <button
                    onClick={() => onSelectCategory && onSelectCategory(cat)}
                    className={`text-[11px] sm:text-sm md:text-base uppercase tracking-widest transition-colors duration-200 cursor-pointer ${isActive
                        ? 'text-[#6CA844] font-bold'
                        : 'text-zinc-800 font-semibold hover:text-[#6CA844]'
                      }`}
                  >
                    {cat}
                  </button>
                  {index < categories.length - 1 && (
                    <span className="text-[#C5DCAC] font-normal select-none text-xs sm:text-base">|</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default NcProjectsSectionHeader;