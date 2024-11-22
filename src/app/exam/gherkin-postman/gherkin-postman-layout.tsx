import React from "react";

interface LayoutProps {
  top: React.ReactNode;     
  left: React.ReactNode;    
  right: React.ReactNode;   
}

const GherkinPostmanLayout: React.FC<LayoutProps> = ({ top, left, right }) => {
  return (
    <div className="flex flex-col h-screen">
   
      <header className="p-4">
        <div className="flex">
          {/* Phần bên trái (Gherkin Tool) */}
          <div className="w-1/2 p-4">
           
            <h1 className="text-xl font-bold">{top.left}</h1>
          
            <div className="mt-2">
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>Gherkin Action</option>
                <option>Delete</option>
                <option>Create</option>
                <option>Create more</option>
              
              </select>
            </div>
          </div>

          <div className="border-l border-gray-300" /> {/* Thanh chia giữa */}

          {/* Phần bên phải (Postman Tool) */}
          <div className="w-1/2 p-4">
       
            <h1 className="text-xl font-bold">{top.right}</h1>
          
            <div className="mt-2">
              <select className="w-full p-2 border border-gray-300 rounded-lg">
                <option>Postman Action</option>
                <option>Delete</option>
                <option>Create</option>
                <option>Create more</option>
                             </select>
            </div>
          </div>
        </div>

        {/* Thanh ngang dưới phần đầu */}
        <div className="border-b border-gray-300 mt-4" /> {/* Đã thêm margin-top ở đây */}
      </header>

      {/* Phần cận giữa: Dropdown */}
      <div className="flex justify-center p-4">
        <select className="w-1/2 p-2 border border-gray-300 rounded-lg">
          <option>Question 1</option>
          <option>Question 2</option>
          <option>Question 3</option>
        </select>
      </div>

      {/* Khung dưới phần cận giữa */}
      <div className="flex justify-center mb-4">
        <div className="w-1/2 p-4 bg-white border border-gray-300 rounded-lg">
          <h2 className="text-lg font-semibold">Question</h2>
          <p>Nội dung Question.</p>
        </div>
      </div>

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
