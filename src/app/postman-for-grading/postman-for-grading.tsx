import React from "react";
import { useParams } from "react-router-dom";
import PostmanForGradingLayout from "./postman-for-grading-layout";

const mockData = [
  { id: 1, request: "POST /api/v1/login", response: "200 OK" },
  { id: 2, request: "GET /api/v1/users", response: "200 OK" },
  { id: 3, request: "DELETE /api/v1/item/1", response: "404 Not Found" },
];

const PostmanForGrading: React.FC = () => {
  const { id } = useParams();

  const paperData = mockData.filter((item) => item.id.toString() === id);

  return (
    <PostmanForGradingLayout
      top={<h1 className="text-xl font-bold">Postman For Grading - Paper ID {id}</h1>}
      left={
        <div>
          <h2 className="text-lg font-semibold">Request Details</h2>
          {paperData.map((item) => (
            <div key={item.id} className="mt-4 p-4 border rounded-lg bg-white">
              <p><strong>Request:</strong> {item.request}</p>
            </div>
          ))}
        </div>
      }
      right={
        <div>
          <h2 className="text-lg font-semibold">Postman for Grading</h2>
        
            <div className="mt-4 p-4 border rounded-lg bg-white">
              <p><strong>Function name: Login</strong></p>
            </div>
            <div className="mt-4 p-4 border rounded-lg bg-white">
              <p><strong>Function name: Get all</strong></p>
            </div>
          
        </div>
      }
    />
  );
};

export default PostmanForGrading;
