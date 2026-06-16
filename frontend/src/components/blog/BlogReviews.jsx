import React from 'react';

const reviews = [
  {
    id: 1,
    name: 'Nirbhay Singh',
    date: 'June 2, 2025',
    content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequans magni dolores eos qui ratione voluptatem sequi nesciunt.'
  },
  {
    id: 2,
    name: 'Michella Ore',
    date: 'June 2, 2025',
    content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit'
  },
  {
    id: 3,
    name: 'Nirbhay Singh',
    date: 'June 2, 2025',
    content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequans magni dolores eos qui ratione voluptatem sequi nesciunt.'
  }
];

const BlogReviews = () => {
  return (
    <div className="mt-16 pt-8">
      <h3 className="font-['Outfit'] text-[32px] md:text-[36px] font-bold text-zinc-900 mb-10">
        Customer Reviews
      </h3>
      
      <div className="space-y-8">
        {reviews.map((review, idx) => (
          <div 
            key={review.id} 
            className={`flex gap-6 ${idx !== reviews.length - 1 ? 'pb-8 border-b border-zinc-200' : ''}`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[60px] h-[60px] text-zinc-300">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Review Content */}
            <div className="flex-1">
              <h4 className="font-['Outfit'] text-[20px] font-bold text-zinc-900 mb-1 leading-none">
                {review.name}
              </h4>
              <p className="text-zinc-400 text-[13px] mb-4">
                {review.date}
              </p>
              <p className="font-['Montserrat'] text-zinc-500 leading-relaxed text-[15px]">
                {review.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogReviews;
