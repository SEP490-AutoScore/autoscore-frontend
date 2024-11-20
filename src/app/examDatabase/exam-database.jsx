import React, { useEffect, useState } from "react";

const ExamDatabase = ({ examPaperId }) => {
  const [database, setDatabase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatabase = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");

        const response = await fetch(
          `http://localhost:8080/api/database/getbyExamPaperId?examPaperId=${examPaperId}`,
          { method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch database information");

        const data = await response.json();
        setDatabase(data);
      } catch (err) {
        console.error(err.message);
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatabase();
  }, [examPaperId]);

  if (loading) return <p>Loading database information...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4 border rounded shadow">
      <h3 className="text-lg font-bold mb-2">Database Information</h3>
      <p><strong>Name:</strong> {database?.databaseName}</p>
      <p><strong>Description:</strong> {database?.databaseDescription || "N/A"}</p>
      <p><strong>Created By:</strong> {database?.createdBy}</p>
      <p><strong>Created At:</strong> {new Date(database?.createdAt || "").toLocaleString()}</p>
      {database?.databaseImage && (
        <img
          src={`data:image/jpeg;base64,${database.databaseImage}`}
          alt="Database Image"
          className="w-32 h-32 mt-2"
        />
      )}
    </div>
  );
};

export default ExamDatabase;
