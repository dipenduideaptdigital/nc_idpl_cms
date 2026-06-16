import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';

import defaultHero from '../assets/blog/hero.jpg';
import sample1 from '../assets/blog/sample1.png';
import sample2 from '../assets/blog/sample2.png';
import sample3 from '../assets/blog/sample3.png';
import BlogDetailHero from '../components/blog/BlogDetailHero';
import BlogSidebar from '../components/blog/BlogSidebar';
import BlogReviews from '../components/blog/BlogReviews';
import CallToAction from '../components/shared/CallToAction';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  useScrollAnimation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
      setLoading(true);
      try {
        // Simulating API fetch for now based on slug
        setTimeout(() => {
          setPost({
            title: 'Functional Design Trends That Blend Style and Comfort',
            featuredImage: sample1,
            author: { name: 'Aaliyah Brown' },
            publishedAt: '2025-06-02T00:00:00Z',
            categories: [{ name: 'Power Tools' }]
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">Post Not Found</h1>
        <p className="text-zinc-500 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
        <Link to="/blog" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Hero Area */}
      <BlogDetailHero post={post} />

      {/* Content Area */}
      <div className="container mx-auto px-4 md:px-8 max-w-7xl mt-16 slide-up mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Blog Detail Content */}
          <div className="lg:col-span-8">
            <div className="bg-white p-0 md:p-0 rounded-3xl bg-transparent">

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-[#3B82F6] text-white text-xs font-bold rounded-full">
                  Power Tools
                </span>
                <span className="text-zinc-500 text-sm font-medium">June 2, 2025</span>
              </div>

              <h1 className="font-['Outfit'] text-[36px] md:text-[43px] font-bold text-zinc-900 leading-tight tracking-tight mb-6">
                Functional Design Trends That Blend Style and Comfort
              </h1>

              {/* Featured Image */}
              <div className="rounded-2xl overflow-hidden mb-8">
                <img src={sample1} alt="Featured" className="w-full h-auto object-cover" />
              </div>

              {/* Text Content */}
              <div className="text-[20px] max-w-none text-zinc-500 leading-[139%] font-normal font-['Outfit']">
                <p className="mb-8">
                  Modern interior design is all
                  about creating a sleek, functional,
                  and aesthetically pleasing space that reflects
                  contemporary living. Whether you're updating a single
                  room or redesigning your entire home, incorporating modern
                  interior design principles can bring a fresh, sophisticated, and elegant ambiance. With an emphasis on minimalism, clean lines, open spaces, and smart functionality, modern interior design.
                </p>

                <h2 className="font-['Outfit'] text-[32px] font-bold text-zinc-900 tracking-tight mb-6 mt-12 pl-2">
                  Understanding the Fundamentals
                </h2>
                <p className="mb-8">
                  Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living. Whether you're updating a single room or redesigning your entire home, incorporating modern interior design principles can bring a fresh, sophisticated, and elegant ambiance. With an emphasis on minimalism, clean lines, open spaces, and smart functionality, modern interior design.
                </p>

                {/* Image Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div className="rounded-2xl overflow-hidden h-[250px]">
                    <img src={sample2} alt="Sample 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-[250px]">
                    <img src={sample3} alt="Sample 3" className="w-full h-full object-cover" />
                  </div>
                </div>

                <h2 className="font-['Outfit'] text-[32px] font-bold text-zinc-900 tracking-tight mb-6 pl-2">
                  Exploring Design Styles
                </h2>
                <p className="mb-8">
                  Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living. Whether you're updating a single room or redesigning your entire home, incorporating modern interior design principles can bring a fresh, sophisticated, and elegant ambiance. With an emphasis on minimalism, clean lines, open spaces, and smart functionality, modern interior design.
                </p>

                {/* Blockquote */}
                <div className="bg-[#EBF5FF] rounded-3xl p-10 relative mt-12 mb-12 overflow-hidden flex flex-col items-center justify-center text-center min-h-[250px]">
                  <div className="absolute top-4 opacity-20 left-1/2 -translate-x-1/2 font-serif text-[180px] leading-none text-[#3B82F6]">
                    &ldquo;
                  </div>
                  <div className="relative z-10 pt-8">
                    <p className="text-xl md:text-2xl font-bold text-zinc-900 leading-snug mb-6 max-w-2xl mx-auto">
                      "Modern interior design transforms ordinary spaces extraordinary environments. The core principle of modern design is 'less is more,' focusing on simplicity and the elimination of clutter."
                    </p>
                    <p className="font-bold text-zinc-800">
                      Aaliyah Brown
                    </p>
                  </div>
                </div>

                <h2 className="font-['Outfit'] text-[32px] font-bold text-zinc-900 tracking-tight mb-4 pl-2">
                  Bringing Modern Interior Design
                </h2>
                <p className="mb-12">
                  Incorporating these modern interior design tips, you can transform your home into a stylish, functional, and comfortable haven. Whether you're making small updates or going for a full renovation, focusing on minimalism, smart technology, natural elements, and functional and enhance the modern look.
                </p>
              </div>

              {/* Prev / Next Navigation */}
              <div className="flex flex-col md:flex-row justify-between items-start border-y border-zinc-200 pt-8 pb-16 mt-10 mb-8 pl-1">
                <Link to="#" className="group flex flex-col items-start w-full md:w-1/2 mb-8 md:mb-0">
                  <div className="flex items-center gap-2 text-zinc-400 font-bold text-[15px] tracking-wider uppercase mb-4 group-hover:text-[#3B82F6] transition-colors">
                    <span>&lt;</span> PREVIOUS POST
                  </div>
                  <div className="font-['Outfit'] font-bold text-[22px] leading-[1.4] text-zinc-900 group-hover:text-[#3B82F6] transition-colors pr-4 max-w-[380px] text-left">
                    Transform Your Home With the Modern Interior Design Tips
                  </div>
                </Link>

                <Link to="#" className="group flex flex-col items-end text-right w-full md:w-1/2">
                  <div className="flex items-center gap-2 text-zinc-400 font-bold text-[15px] tracking-wider uppercase mb-4 group-hover:text-[#3B82F6] transition-colors">
                    NEXT POST <span>&gt;</span>
                  </div>
                  <div className="font-['Outfit'] font-bold text-[22px] leading-[1.4] text-zinc-900 group-hover:text-[#3B82F6] transition-colors pl-4 max-w-[380px] text-right">
                    Innovative Interior Ideas to Refresh Your Living Space
                  </div>
                </Link>
              </div>

              {/* Customer Reviews Section */}
              <BlogReviews />

            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4">
            <BlogSidebar />
          </div>

        </div>
      </div>

      {/* Call To Action Section */}
      <CallToAction />
    </div>
  );
};

export default BlogDetail;
