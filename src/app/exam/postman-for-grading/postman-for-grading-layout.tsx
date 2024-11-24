import React from "react";

interface LayoutProps {
  top?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const PostmanForGradingLayout: React.FC<LayoutProps> = ({ top, left, right }) => {
  return (
    <div className="p-8">
      {/* Header */}
      {top && <div>{top}</div>} 
   
      {/* Content */}
      <div className="flex flex-1">
       
        <div className="w-1/4 p-4 border-r border-gray-200">
          {left}
        </div>
  
        <div className="w-3/4 p-4">
          {right}
        </div>
      </div>
    </div>
  );
};

export default PostmanForGradingLayout;
