import React, { useState, useEffect } from 'react';
import gallery2 from '../../assets/homepage/gallery2.png';
import gallery1 from '../../assets/homepage/gallery1.png';
import gallery5 from '../../assets/homepage/gallery5.png';
import apiClient from '../../api/client';

const defaultBlogPosts = [
  { id: 1, author: 'Admin', title: 'Functional Design Trends That Blend Style And Comfort', excerpt: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: gallery2 },
  { id: 2, author: 'Admin', title: 'Functional Design Trends That Blend Style And Comfort', excerpt: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: gallery5 },
  { id: 3, author: 'Admin', title: 'Functional Design Trends That Blend Style And Comfort', excerpt: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: gallery1 }
];

const BlogSection = () => {
  const [content, setContent] = useState(null);
  const [postsList, setPostsList] = useState(defaultBlogPosts);

  useEffect(() => {
    let isMounted = true;

    const fetchBlogsData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_blog_section');
        const { data } = res;

        if (data.success && data.data?.content) {
          const fetchedContent = data.data.content;
          if (isMounted) setContent(fetchedContent);

          const serverUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');

          if (fetchedContent.posts && fetchedContent.posts.length > 0) {
            const mapped = fetchedContent.posts.map((post, idx) => {
              const defaultImg = defaultBlogPosts[idx % defaultBlogPosts.length].image;
              return {
                ...post,
                image: post.image ? `${serverUrl}${post.image}` : defaultImg
              };
            });
            if (isMounted) setPostsList(mapped);
          } else if (isMounted) {
            setPostsList(defaultBlogPosts);
          }
        }
      } catch (error) {
        console.error('Failed to fetch blog content:', error);
      }
    };

    fetchBlogsData();

    return () => {
      isMounted = false;
    };
  }, []);

  const badgeText = content?.badgeText || "STRAIGHT FROM THE NEWSROOM";
  const title = content?.title || "Take A Look At [Our Latest \\n Blog] & Articles.";

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-primary">
            {part.slice(1, -1).split(/\\n|\n/).map((line, lIdx, arr) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }
      return part.split(/\\n|\n/).map((line, lIdx, arr) => (
        <React.Fragment key={lIdx}>
          {line}
          {lIdx < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20">
          <div className="max-w-2xl fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText}
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              {renderTitle(title)}
            </h2>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {postsList.map((post, index) => (
            <div key={post.id || index} className="group cursor-pointer flex flex-col opal-move-up">
              <div className="w-full h-64 md:h-80 rounded-[2rem] overflow-hidden mb-6 shadow-md">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const defaultImg = defaultBlogPosts[index % defaultBlogPosts.length].image;
                    if (e.currentTarget.src !== defaultImg) {
                      e.currentTarget.src = defaultImg;
                    }
                  }}
                />
              </div>
              
              <div className="px-2">
                <p className="text-xs text-gray-500 font-medium mb-3">
                  By <span className="text-primary hover:underline">{post.author}</span>
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BlogSection;