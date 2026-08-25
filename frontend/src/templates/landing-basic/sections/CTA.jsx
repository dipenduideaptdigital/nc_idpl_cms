import React from 'react';
import { Link } from 'react-router-dom';

const CTA = ({ data }) => {
  if (!data) return null;
  return (
    <div className="py-16 bg-blue-50 text-center">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">{data.title}</h2>
        {data.buttonText && (
          <Link 
            to={data.buttonLink || '#'} 
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            {data.buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default CTA;