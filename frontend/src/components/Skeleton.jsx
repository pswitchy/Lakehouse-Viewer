import React from 'react';

// A simple UI component to show while data is loading
const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`}></div>
  );
};

export default Skeleton;