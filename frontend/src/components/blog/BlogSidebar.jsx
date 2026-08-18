import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetResolver';
import defaultThumbnailPlaceholder from '../../assets/blog/sample1.png';

export const SearchWidget = ({ onSearchSubmit, localSearchInputTerm, setLocalSearchInputString }) => (
  <div>
    <h3 className="font-kanit text-[28px] md:text-[36px] lg:text-[43px] font-medium leading-none text-zinc-900 mb-6">Search</h3>
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        if (onSearchSubmit) onSearchSubmit(localSearchInputTerm.trim());
      }} 
      className="relative"
    >
      <input 
        type="text" 
        placeholder="Search...." 
        value={localSearchInputTerm}
        onChange={(e) => setLocalSearchInputString(e.target.value)}
        className="w-full border border-zinc-200 rounded-full py-3.5 px-6 pr-12 focus:outline-none focus:border-[#6CA844] focus:ring-1 focus:ring-[#6CA844] transition-all text-base font-extralight text-zinc-600 placeholder-zinc-400 font-kanit"
      />
      <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-[#6CA844] transition-colors">
        <Search className="w-5 h-5" />
      </button>
    </form>
  </div>
);

export const CategoriesWidget = ({ categories, activeCategorySlug, onCategorySelect }) => {
  if (!categories || categories.length === 0) return null;
  return (
    <div>
      <h3 className="font-kanit text-[28px] md:text-[36px] lg:text-[43px] font-medium leading-none text-zinc-900 mb-6">Categories</h3>
      <ul className="flex flex-col border-t border-zinc-200">
        {categories.map((category) => {
          const isSelectedNode = activeCategorySlug === category.slug;
          return (
            <li 
              key={category.id} 
              onClick={() => onCategorySelect && onCategorySelect(category.slug)}
              className={`font-kanit text-[18px] md:text-[22px] font-medium capitalize border-b border-zinc-200 py-4 flex justify-between items-center transition-colors cursor-pointer ${
                isSelectedNode ? 'text-[#6CA844]' : 'text-zinc-600 hover:text-[#6CA844]'
              }`}
            >
              <span>{category.name}</span>
              <span className="text-xs font-bold bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-full border border-zinc-200/60 font-kanit">
                {category._count?.blogs || 0}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const BlogSidebar = ({ sidebarData, onSearchSubmit, activeCategorySlug, onCategorySelect, onTagSelect, isMobileTop = false }) => {
  const [localSearchInputTerm, setLocalSearchInputString] = useState('');
  const navigate = useNavigate();

  const structuralCategoriesList = sidebarData?.categories || [];
  const structuralRecentPostsList = sidebarData?.recentPosts || [];
  const structuralPopularTagsList = sidebarData?.popularTags || [];

  if (isMobileTop) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-8 md:gap-12 items-start font-kanit">
        <SearchWidget 
          onSearchSubmit={onSearchSubmit} 
          localSearchInputTerm={localSearchInputTerm} 
          setLocalSearchInputString={setLocalSearchInputString} 
        />
        <CategoriesWidget 
          categories={structuralCategoriesList} 
          activeCategorySlug={activeCategorySlug} 
          onCategorySelect={onCategorySelect} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-12 font-kanit">
      {/* Desktop Search & Categories */}
      <div className="hidden lg:block space-y-12">
        <SearchWidget 
          onSearchSubmit={onSearchSubmit} 
          localSearchInputTerm={localSearchInputTerm} 
          setLocalSearchInputString={setLocalSearchInputString} 
        />
        <CategoriesWidget 
          categories={structuralCategoriesList} 
          activeCategorySlug={activeCategorySlug} 
          onCategorySelect={onCategorySelect} 
        />
      </div>

      {/* Dynamic Recent Posts Timeline Feeds */}
      {structuralRecentPostsList.length > 0 && (
        <div className="space-y-6 pt-4">
          <h3 className="font-kanit text-[28px] font-medium leading-none text-zinc-900 mb-6">Recent Posts</h3>
          {structuralRecentPostsList.map((post) => {
            const computedThumbImgLink = resolveAssetUrl(post.featuredImage?.thumbnailUrl || post.featuredImage?.url, defaultThumbnailPlaceholder);
            const categoryName = post.categories?.[0]?.name;
            return (
              <div 
                key={post.id || post.slug} 
                onClick={() => navigate(`/blog/${post.slug}`)} 
                className="flex items-center gap-4 sm:gap-5 group cursor-pointer border-b border-zinc-100 pb-5 last:border-0"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-100 bg-zinc-50 shadow-sm">
                  <img 
                    src={computedThumbImgLink} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300';
                    }}
                  />
                </div>
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <h4 className="font-kanit font-medium text-zinc-900 text-base sm:text-lg mb-3 leading-snug line-clamp-2 text-left">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-3 flex-wrap">
                    {categoryName && (
                      <span className="px-3.5 py-1 bg-[#6CA844] text-white text-xs font-normal rounded-full tracking-wide">
                        {categoryName}
                      </span>
                    )}
                    <span className="text-zinc-600 text-xs sm:text-sm font-kanit">
                      {new Date(post.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dynamic Taxonomies Tags Matrix Cloud */}
      {structuralPopularTagsList.length > 0 && (
        <div>
          <h3 className="font-kanit text-[32px] md:text-[43px] font-medium leading-none text-zinc-900 mb-6 mt-6">Popular Tags</h3>
          <div className="flex flex-wrap justify-center gap-2.5">
            {structuralPopularTagsList.map((tag) => (
              <span 
                key={tag.id} 
                onClick={() => onTagSelect && onTagSelect(tag.slug)}
                className="px-4 py-2 border border-zinc-200 rounded-full text-[12px] md:text-[13px] font-medium text-zinc-600 hover:border-[#6CA844] hover:text-[#6CA844] cursor-pointer bg-white hover:bg-green-50/20 transition-all shadow-sm font-kanit"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogSidebar;