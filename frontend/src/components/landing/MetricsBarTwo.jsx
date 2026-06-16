import React from 'react';

const MetricsBarTwo = ({ data }) => {
  const metrics = data?.metrics || [
    { value: '3,000+', label: 'INTERIOR DESIGNS' },
    { value: '1,500+', label: 'RENOVATIONS' },
    { value: '500+', label: 'COMMERCIAL PROJECTS' },
    { value: '25+', label: 'AWARDS WON' }
  ];

  return (
    <section className="py-12 px-8 bg-[#f0f6fc]">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">{metric.value}</h3>
              <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsBarTwo;
