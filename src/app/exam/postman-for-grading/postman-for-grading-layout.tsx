import React from "react";

interface LayoutProps {
  top?: React.ReactNode;
  leftTop?: React.ReactNode;
  leftBottom?: React.ReactNode;
  right?: React.ReactNode;
}

const PostmanForGradingLayout: React.FC<LayoutProps> = ({ top, leftTop, leftBottom, right }) => {
  return (
    <div className="p-8">
      {/* Header */}
      {top && <div>{top}</div>} 
   
      {/* Content */}
      <div className="flex flex-1">
       
      <div className="w-1/4 p-4 border-r border-gray-200 flex flex-col">
          {/* Left Top */}
          {leftTop && <div className="mb-4">{leftTop}</div>}
          {/* Left Bottom */}
          {leftBottom && <div>{leftBottom}</div>}
        </div>
        
        <div className="w-3/4 p-4">
          {right}
        </div>
      </div>
    </div>
  );
};

export default PostmanForGradingLayout;
