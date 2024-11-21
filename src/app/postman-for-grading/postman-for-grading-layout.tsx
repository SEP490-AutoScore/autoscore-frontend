import React from "react";

interface LayoutProps {
  top?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const PostmanForGradingLayout: React.FC<LayoutProps> = ({ top, left, right }) => {
  return (
    <div className="h-screen flex flex-col">
      {top && <div className="bg-gray-100 p-4">{top}</div>}

      <div className="flex flex-1">
        {left && <div className="w-1/4 p-4 border-r">{left}</div>}
        <div className="w-3/4 p-4">{right}</div>
      </div>
    </div>
  );
};

export default PostmanForGradingLayout;
