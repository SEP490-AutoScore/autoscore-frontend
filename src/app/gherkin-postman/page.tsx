import React, { useState } from "react";
import GherkinPostmanLayout from "./GherkinPostmanLayout";
import GherkinItem from "./GherkinItem";
import PostmanItem from "./PostmanItem";
import { SidebarInset } from "@/components/ui/sidebar"; // Import SidebarInset
import { useLocation } from "react-router-dom";
import { useHeader } from "@/hooks/use-header"; // Giống trong examDetail
import { ErrorPage } from "@/app/error/page";

// Giả lập dữ liệu
const mockData = [
  { id: 1, gherkin: "Given I am a user\nWhen I click on 'start'\nThen I should see the homepageGiven I am a user\nWhen I click on 'start'\nThen I should see the homepageGiven I am a user\nWhen I click on 'start'\nThen I should see the homepage", postman: "POST /api/v1/start - { 'userId': 123 }" },
  { id: 2, gherkin: "Given I am on the homepage\nWhen I click 'Login'\nThen I should see the login page", postman: "GET /api/v1/login " },
  { id: 3, gherkin: "Given I have logged in\nWhen I navigate to the dashboard\nThen I should see my profile", postman: "GET /api/v1/dashboard" },
];

const Page: React.FC = () => {
  const [selectedGherkinIds, setSelectedGherkinIds] = useState<number[]>([]);
  const [selectedPostmanIds, setSelectedPostmanIds] = useState<number[]>([]);

  const [editingGherkinId, setEditingGherkinId] = useState<number | null>(null);
  const [editingPostmanId, setEditingPostmanId] = useState<number | null>(null);

  const [gherkinContent, setGherkinContent] = useState<string>("");
  const [postmanContent, setPostmanContent] = useState<string>("");

  const location = useLocation();
  const id = location.state?.gherkinPostmanId; // Lấy ID từ state
  const role = localStorage.getItem("role");

  // if (!id) {
  //   return <div>Error: GherkinPostman ID not provided</div>;
  // }

  // if (!role) {
  //   return <ErrorPage />;
  // }

  const Header = useHeader({
    breadcrumbLink: "/gherkin-postman",
    breadcrumbLink_2: `/gherkin-postman/${id}`,
    breadcrumbPage: "Gherkin Postman",
    breadcrumbPage_2: `Postman ID ${id}`,
  });


  const handleGherkinClick = (id: number) => {
    setSelectedGherkinIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handlePostmanClick = (id: number) => {
    setSelectedPostmanIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDoubleClickGherkin = (item: any) => {
    setEditingGherkinId(item.id);
    setGherkinContent(item.gherkin);
  };

  const handleDoubleClickPostman = (item: any) => {
    setEditingPostmanId(item.id);
    setPostmanContent(item.postman);
  };

  const handleSaveGherkin = (id: number) => {
    mockData.find(item => item.id === id)!.gherkin = gherkinContent;
    setEditingGherkinId(null);
  };

  const handleSavePostman = (id: number) => {
    mockData.find(item => item.id === id)!.postman = postmanContent;
    setEditingPostmanId(null);
  };

  const handleCancelGherkin = () => {
    setEditingGherkinId(null);
  };

  const handleCancelPostman = () => {
    setEditingPostmanId(null);
  };

  return (
    <SidebarInset>
         {Header}
    <GherkinPostmanLayout
      top={{
        left: <div className="bg-white border border-gray-300 rounded-lg p-4"><h1 className="text-xl font-bold">Gherkin</h1></div>,
        right: <div className="bg-white border border-gray-300 rounded-lg p-4"><h1 className="text-xl font-bold">Postman</h1></div>,
      }}
      left={
        <div className="flex flex-col h-full">
          {mockData.map(item => (
            <GherkinItem
              key={item.id}
              id={item.id}
              gherkin={item.gherkin}
              onClick={handleGherkinClick}
              onDoubleClick={handleDoubleClickGherkin}
              editingId={editingGherkinId}
              onSave={handleSaveGherkin}
              onCancel={handleCancelGherkin}
              isSelected={selectedGherkinIds.includes(item.id)}  // Truyền isSelected vào đây
            />
          ))}
        </div>
      }
      right={
        <div className="flex flex-col h-full">
          {mockData.map(item => (
            <PostmanItem
              key={item.id}
              id={item.id}
              postman={item.postman}
              onClick={handlePostmanClick}
              onDoubleClick={handleDoubleClickPostman}
              editingId={editingPostmanId}
              onSave={handleSavePostman}
              onCancel={handleCancelPostman}
              isSelected={selectedPostmanIds.includes(item.id)}  // Truyền isSelected vào đây
            />
          ))}
        </div>
      }
    />
    </SidebarInset>
  );
};

export default Page;
