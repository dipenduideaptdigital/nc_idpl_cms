import React from 'react';

const NcProjectOverview = ({ project }) => {
  const sectionTitle = project?.category || "OUR PROJECTS";
  const projectName = project?.title || "ADA 90 P";
  const location = project?.location || "KOLKATA";
  
  const detailsTitle = project?.subtitle || "PROJECT DETAILS";
  const detailsDescription = project?.details || "<p>Explore the intricate details of this beautiful aquascape and living art project.</p>";
  
  const specificationsTitle = "SPECIFICATIONS";
  const specifications = project?.specifications || "Not Specified";

  return (
    <section className="w-full bg-white text-zinc-900 py-16 sm:py-24 px-6 sm:px-12 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 lg:gap-24 items-start">
          
          <div className="md:col-span-5 flex flex-col items-start">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-black tracking-wider uppercase mb-12 sm:mb-16 font-reem">
              {sectionTitle}
            </h2>
            
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-extrabold text-black tracking-wide uppercase font-kanit">
                {projectName}
              </h3>
              <p className="text-xs font-semibold text-zinc-400 tracking-widest uppercase font-kanit">
                {location}
              </p>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col space-y-10 lg:pt-2">
            
            <div className="space-y-4">
              <h4 className="text-[13px] font-bold text-black tracking-wider uppercase font-kanit">
                {detailsTitle}
              </h4>
              <div 
                className="text-[#6A6A6A] text-sm sm:text-[15px] leading-relaxed font-normal font-kanit max-w-3xl [&>p]:mb-4 last:[&>p]:mb-0"
                dangerouslySetInnerHTML={{ __html: detailsDescription }}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-[13px] font-bold text-black tracking-wider uppercase font-kanit">
                {specificationsTitle}
              </h4>
              <p className="text-[#6A6A6A] text-sm sm:text-[15px] font-medium tracking-wide uppercase font-kanit">
                {specifications}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default NcProjectOverview;