import React from 'react';

const Content = ({ data }) => {
  if (!data) return null;
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-zinc-900 mb-6">{data.heading}</h2>
        <div 
          className="text-zinc-600 prose max-w-none mx-auto text-left"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      </div>
    </div>
  );
};

export default Content;