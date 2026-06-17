import React from 'react';

const MetricsBarOne = ({ data }) => {
  const metrics = data?.metrics || [];

  return (
    <section className="py-10 px-8 bg-[#eef4fa]">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center space-y-1">
              <h3 className="text-xl md:text-2xl font-bold text-[#d83f3f] tracking-wide">{metric.value}</h3>
              <p className="text-lg md:text-xl font-medium text-black tracking-wide">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsBarOne;