'use client';

import React from 'react';

const FullScreenScene = ({ 
  children, 
  bgImage, 
  className = "",
  overlay = true,
  overlayOpacity = 0.4 
}) => {
  return (
    <div 
      className={`min-h-screen w-full relative bg-cover bg-center bg-no-repeat ${className}`}
      style={{ 
        backgroundImage: `url('${bgImage}')`,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better text readability */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default FullScreenScene;