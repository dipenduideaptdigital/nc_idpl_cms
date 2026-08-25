import React from 'react';

const Hero = ({ data }) => {
  if (!data) return null;
  return (
    <div 
      className="relative w-full h-[60vh] flex items-center justify-center bg-zinc-900 bg-cover bg-center"
      style={{ backgroundImage: data.image ? `url(${data.image})` : 'none' }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10 text-center text-white px-4 max-w-3xl">
        <h1 className="text-5xl font-bold mb-4">{data.title}</h1>
        <div 
          className="text-lg text-gray-200 prose-p:my-2"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
      </div>
    </div>
  );
};

export default Hero;