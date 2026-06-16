import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BlogSidebar from './BlogSidebar';
import sample1 from '../../assets/blog/sample1.png'
import sample2 from '../../assets/blog/sample2.png'
import sample3 from '../../assets/blog/sample3.png'

const posts = [
  {
    id: 1,
    slug: 'functional-design-trends',
    image: sample1,
    categories: ['Power Tools'],
    date: 'June 2, 2025',
    title: 'Functional Design Trends That Blend Style and Comfort',
    excerpt: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living. Whether you\'re updating a single room or redesigning your entire home, incorporating modern interior design principles can bring a fresh, sophisticated, and elegant ambiance.'
  },
  {
    id: 2,
    slug: 'functional-design-trends-2',
    image: sample2,
    categories: ['Power Tools'],
    date: 'June 2, 2025',
    title: 'Functional Design Trends That Blend Style and Comfort',
    excerpt: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living. Whether you\'re updating a single room or redesigning your entire home, incorporating modern interior design principles can bring a fresh, sophisticated, and elegant ambiance.'
  },
  {
    id: 3,
    slug: 'functional-design-trends-3',
    image: sample3,
    categories: ['Power Tools', 'Electrical & Lighting'],
    date: 'June 2, 2025',
    title: 'Functional Design Trends That Blend Style and Comfort',
    excerpt: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living. Whether you\'re updating a single room or redesigning your entire home, incorporating modern interior design principles can bring a fresh, sophisticated, and elegant ambiance.'
  }
];

const categories = [
  'Accessories',
  'Electrical & Lighting',
  'Home Appliance',
  'Power Tools',
  'Uncategorized',
  'Ware Accessories'
];

const tags = [
  'Architecture', 'Design', 'Kitchen', 'Construction', 
  'Architecture', 'Design', 'Kitchen', 'Construction',
  'Architecture'
];

const BlogContent = () => {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-7xl mt-16 mb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Blog Posts */}
        <div className="lg:col-span-8 space-y-16">
          {posts.map((post, idx) => (
            <article key={idx} className="group">
              <Link to={`/blog/${post.slug}`} className="block rounded-2xl overflow-hidden mb-6">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-2">
                  {post.categories.map((cat, cIdx) => (
                    <span key={cIdx} className="px-4 py-1.5 bg-[#3B82F6] text-white text-xs font-semibold rounded-full">
                      {cat}
                    </span>
                  ))}
                </div>
                <span className="text-zinc-500 text-sm font-medium">{post.date}</span>
              </div>
              <Link to={`/blog/${post.slug}`} className="block">
                <h2 className="font-['Outfit'] text-[43px] font-semibold leading-none text-zinc-900 mb-4 hover:text-blue-600 transition-colors cursor-pointer">
                  {post.title}
                </h2>
              </Link>
              <p className="text-zinc-500 mb-4 leading-relaxed">
                {post.excerpt}
              </p>
              <Link to={`/blog/${post.slug}`} className="inline-block text-zinc-900 text-sm font-bold border-b-[3px] border-zinc-900 pb-0.5 hover:text-blue-600 hover:border-blue-600 transition-colors uppercase tracking-wider">
                Read More
              </Link>
            </article>
          ))}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-16">
            <button className="w-10 h-10 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-bold shadow-md hover:bg-blue-600 transition-colors">
              1
            </button>
            <button className="w-10 h-10 rounded-full bg-transparent text-zinc-900 flex items-center justify-center font-bold hover:bg-zinc-100 transition-colors">
              2
            </button>
            <button className="w-10 h-10 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-bold shadow-md hover:bg-blue-600 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-4">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
};

export default BlogContent;
