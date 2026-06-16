import React from 'react';
import { Star } from 'lucide-react';

const TrustedClients = ({ data }) => {
  const reviews = data?.reviews?.length > 0 ? data.reviews : [
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      author: "Stephanie",
      role: "",
      rating: 5
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      author: "Stephanie",
      role: "",
      rating: 5
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      author: "Stephanie",
      role: "",
      rating: 5
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      author: "Stephanie",
      role: "",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-white text-center overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900 tracking-tight">
          {data?.title || 'Trusted By Our Clients'}
        </h2>
        <p className="text-zinc-600 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-6">
          {data?.subtitle || "Hear How We've Transformed Spaces And Exceeded Expectations."}
        </p>
        
        <div className="flex flex-col items-center justify-center gap-2 mb-8">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-[#fcc144] text-[#fcc144]" />
            ))}
          </div>
          <p className="text-zinc-500 font-medium text-lg mt-2">4.5 average star review</p>
        </div>
      </div>

      <div className="w-full flex overflow-x-auto hide-scrollbar pb-24 pt-4 px-4 md:px-8 gap-6 md:gap-8 snap-x snap-mandatory">
        {reviews.map((review, idx) => (
          <div 
            key={idx} 
            className={`flex-none w-[320px] md:w-[380px] bg-[#e8efe8] p-10 rounded-3xl text-left shadow-sm border border-transparent hover:shadow-md transition-shadow snap-center ${idx % 2 === 1 ? 'translate-y-12' : ''}`}
          >
            <p className="text-zinc-700 leading-relaxed mb-10 text-base font-medium">
              {review.text}
            </p>
            <div className="flex items-center gap-4 mt-auto">
              <div className="w-14 h-14 bg-white rounded-full border-[3px] border-white shadow-sm shrink-0"></div>
              <div>
                <h4 className="font-bold text-zinc-900 text-lg">{review.author}</h4>
                {review.role && <p className="text-sm text-zinc-500">{review.role}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustedClients;
