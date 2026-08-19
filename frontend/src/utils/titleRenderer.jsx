import React from 'react';

export const renderTitle = (titleText, highlightClass = "text-[#6CA844] transition-colors duration-300 hover:text-[#568a35]") => {
  if (!titleText) return null;
  
  // Split by newline first to support manual line breaks
  const lines = titleText.split(/\r?\n/);
  
  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\[[^\]]+\])/g);
    const renderedLine = parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className={highlightClass}>
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });

    return (
      <React.Fragment key={lineIndex}>
        {lineIndex > 0 && <br />}
        {renderedLine}
      </React.Fragment>
    );
  });
};