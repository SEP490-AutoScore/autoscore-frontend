import React from "react";

interface LayoutProps {
  top: React.ReactNode;
  middle: React.ReactNode;
  left: React.ReactNode;
  right: React.ReactNode;
}

const GherkinPostmanLayout: React.FC<LayoutProps> = ({ top, middle, left, right }) => {
  return (

    <div>
      <header className="p-4">
        <div className="flex">
          {/* Phần bên trái (Gherkin Tool) */}
          <div className="w-1/2 p-4">
            {top.left}
          </div>

          <div className="border-l border-gray-300" /> {/* Thanh chia giữa */}
          {/* Phần bên phải (Postman Tool) */}

          <div className="w-1/2 p-4">
            {top.right}
          </div>

        </div>

        {/* Thanh ngang dưới phần đầu */}
        {/* <div className="border-b border-gray-300 mt-4" /> */}
      </header>


      {middle}


      {/* Phần giữa (Chia đôi màn hình: trái phải) và có thanh chia giữa */}
      <div className="flex flex-1 mb-2">
        {/* Bên trái: Nội dung Gherkin */}
        <div className="flex-1 p-4 flex flex-col min-h-[200px] overflow-y-auto">
          {left}
        </div>

        {/* Thanh chia giữa */}
        <div className="border-l border-gray-300 mt-2 mb-4" />

        {/* Bên phải: Nội dung Postman */}
        <div className="flex-1 p-4 flex flex-col min-h-[200px] overflow-y-auto">
          {right}
        </div>
      </div>
    </div>
  );
};

export default GherkinPostmanLayout;
