import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import sample1 from '../../assets/blog/sample1.png';
import sample2 from '../../assets/blog/sample2.png';
import sample3 from '../../assets/blog/sample3.png';

const recentPosts = [
  { slug: 'functional-design-trends', image: sample1, categories: ['Power Tools'], date: 'June 2, 2025', title: 'Functional Design Trends That Blend Style and Comfort' },
  { slug: 'functional-design-trends-2', image: sample2, categories: ['Power Tools'], date: 'June 2, 2025', title: 'Functional Design Trends That Blend Style and Comfort' },
  { slug: 'functional-design-trends-3', image: sample3, categories: ['Power Tools'], date: 'June 2, 2025', title: 'Functional Design Trends That Blend Style and Comfort' }
];

const categories = ['Accessories', 'Electrical & Lighting', 'Home Appliance', 'Power Tools', 'Uncategorized', 'Ware Accessories'];
const tags = ['Architecture', 'Design', 'Kitchen', 'Construction', 'Architecture', 'Design', 'Kitchen', 'Construction', 'Architecture'];

const BlogSidebar = () => {
  return (
    <div className="space-y-12">
      {/* Search */}
      <div>
        <h3 className="font-['Outfit'] text-[43px] font-semibold leading-none text-zinc-900 mb-6">Search</h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search...." 
            className="w-full border border-zinc-200 rounded-full py-3.5 px-6 pr-12 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all text-sm font-medium text-zinc-600 placeholder-zinc-400"
          />
          <button className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-[#3B82F6] transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="w-[343px] h-[567px]">
        <h3 className="font-['Outfit'] text-[43px] font-semibold leading-none text-zinc-900 mb-6 mt-10">Categories</h3>
        <ul className="flex flex-col">
          {categories.map((cat, idx) => (
            <li key={idx} className={`font-['Montserrat'] text-[25px] font-semibold leading-[25px] capitalize border-b border-zinc-100 last:border-0 py-4 ${cat === 'Power Tools' ? 'text-[#3B82F6]' : 'text-zinc-600'} hover:text-[#3B82F6] transition-colors cursor-pointer`}>
              {cat}
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts List */}
      <div className="space-y-6 pt-6">
        {recentPosts.map((post, idx) => (
          <Link to={`/blog/${post.slug}`} key={idx} className="flex gap-4 group cursor-pointer">
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="font-bold text-zinc-900 text-[15px] mb-2 leading-snug group-hover:text-[#3B82F6] transition-colors line-clamp-2">
                {post.title}
              </h4>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#3B82F6] text-white text-[10px] font-bold rounded-full">
                  {post.categories[0]}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium">{post.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Popular Tags */}
      <div>
        <h3 className="font-['Outfit'] text-[43px] font-semibold leading-none text-zinc-900 mb-6 mt-12">Popular Tags</h3>
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag, idx) => (
            <span 
              key={idx} 
              className="px-5 py-2 border border-zinc-300 rounded-full text-[13px] font-medium text-zinc-600 hover:border-[#3B82F6] hover:text-[#3B82F6] cursor-pointer transition-all"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
