import React from 'react';
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../utils/assetResolver';

const NcProjectsGrid = ({ projects = [] }) => {
  const chunks = [];
  for (let i = 0; i < projects.length; i += 4) {
    chunks.push(projects.slice(i, i + 4));
  }

  if (projects.length === 0) {
    return (
      <div className="w-full text-center py-20 text-zinc-500 font-kanit text-lg">
        No projects found in this category.
      </div>
    );
  }

  return (
    <section className="w-full bg-white pb-20 pt-4 px-6 sm:px-12 md:px-16 font-kanit">
      <div className="max-w-[1728px] mx-auto space-y-4 sm:space-y-6">
        {chunks.map((chunk, chunkIndex) => (
          <React.Fragment key={chunkIndex}>
            
            {chunk[0] && (
              <Link 
                to={`/projects/${chunk[0].slug}`} 
                className="block relative w-full h-[340px] sm:h-[440px] md:h-[540px] lg:h-[620px] overflow-hidden group shadow-sm bg-zinc-100 cursor-pointer"
              >
                <img 
                  src={resolveAssetUrl(chunk[0].featuredImage?.url || chunk[0].featuredImageId, '/default-project.png')} 
                  alt={chunk[0].title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                  loading="lazy" 
                />
              </Link>
            )}

            {(chunk[1] || chunk[2]) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {chunk[1] && (
                  <Link 
                    to={`/projects/${chunk[1].slug}`} 
                    className="block relative w-full h-[280px] sm:h-[360px] md:h-[440px] lg:h-[500px] overflow-hidden group shadow-sm bg-zinc-100 cursor-pointer"
                  >
                    <img 
                      src={resolveAssetUrl(chunk[1].featuredImage?.url || chunk[1].featuredImageId, '/default-project.png')} 
                      alt={chunk[1].title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                      loading="lazy" 
                    />
                  </Link>
                )}
                {chunk[2] && (
                  <Link 
                    to={`/projects/${chunk[2].slug}`} 
                    className="block relative w-full h-[280px] sm:h-[360px] md:h-[440px] lg:h-[500px] overflow-hidden group shadow-sm bg-zinc-100 cursor-pointer"
                  >
                    <img 
                      src={resolveAssetUrl(chunk[2].featuredImage?.url || chunk[2].featuredImageId, '/default-project.png')} 
                      alt={chunk[2].title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                      loading="lazy" 
                    />
                  </Link>
                )}
              </div>
            )}

            {chunk[3] && (
              <Link 
                to={`/projects/${chunk[3].slug}`} 
                className="block relative w-full h-[340px] sm:h-[440px] md:h-[540px] lg:h-[620px] overflow-hidden group shadow-sm bg-zinc-100 cursor-pointer"
              >
                <img 
                  src={resolveAssetUrl(chunk[3].featuredImage?.url || chunk[3].featuredImageId, '/default-project.png')} 
                  alt={chunk[3].title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                  loading="lazy" 
                />
              </Link>
            )}

          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default NcProjectsGrid;