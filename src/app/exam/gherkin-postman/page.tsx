import React, { useState, useEffect } from "react";
import GherkinPostmanLayout from "./gherkin-postman-layout";

const GherkinPostmanPage: React.FC = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.error("JWT Token không tồn tại. Vui lòng đăng nhập.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/gherkin_scenario/pairs?examPaperId=1",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchData();
  }, [token]);

  const gherkinContent = (
    <div>
      {data.map((item: any, index) => (
        <div
          key={index}
          className="mb-4 p-4 border rounded-lg bg-gray-100 shadow-sm resize-y overflow-auto h-64" 
    
   
        >
          <h3 className="font-semibold text-lg">
            Scenario #{item.gherkin?.gherkinScenarioId}
          </h3>
          <pre className="text-sm whitespace-pre-wrap">
            {item.gherkin?.gherkinData}
          </pre>
        </div>
      ))}
    </div>
  );

  const postmanContent = (
    <div>
      {data.map((item: any, index) => (
        <div
          key={index}
          className="mb-4 p-4 border rounded-lg bg-gray-100 shadow-sm resize-y overflow-auto h-64" 
        >
          {item.postman ? (
            <>
              <h3 className="font-semibold text-lg">
                Postman Function: {item.postman.postmanFunctionName}
              </h3>
              <p className="text-sm">Total PM Tests: {item.postman.totalPmTest}</p>
         
              <pre className="text-sm whitespace-pre-wrap bg-gray-200 p-2 rounded">
                {atob(item.postman.fileCollectionPostman)}
              </pre>

              <p className="text-sm">Status: {item.postman.status ? "Active" : "Inactive"}</p>
            </>
          ) : (
            <p className="italic text-gray-500">No Postman data available.</p>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <GherkinPostmanLayout
      top={{
        left: "Gherkin Tool",
        right: "Postman Tool",
      }}
      left={gherkinContent}
      right={postmanContent}
    />
  );
};

export default GherkinPostmanPage;
