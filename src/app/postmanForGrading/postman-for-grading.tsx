// import React, { useEffect, useState } from "react";

// interface PostmanForGrading {
//     postmanForGradingId: number;
//     postmanFunctionName: string;
//     postmanForGradingParentId: number | null;
//     scoreOfFunction: number;
//     totalPmTest: number;
//     orderBy: number;
//     examQuestionId: number;
//     gherkinScenarioId: number | null;
// }

// interface PostmanForGradingProps {
//     examPaperId: number;
// }

// const PostmanForGrading: React.FC<PostmanForGradingProps> = ({ examPaperId }) => {
//     const [data, setData] = useState<PostmanForGrading[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     // Fetch dữ liệu ban đầu
//     useEffect(() => {
//         const fetchPostmanData = async () => {
//             try {
//                 setLoading(true);
//                 const token = localStorage.getItem("jwtToken");
//                 if (!token) throw new Error("JWT Token không tồn tại.");

//                 const response = await fetch(`http://localhost:8080/api/postman-grading/${examPaperId}`, {
//                     method: "GET",
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 if (!response.ok) throw new Error("Failed to fetch postman data");

//                 const result: PostmanForGrading[] = await response.json();
//                 setData(result);
//             } catch (err: any) {
//                 setError(err.message || "An unknown error occurred.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPostmanData();
//     }, [examPaperId]);

//     // Xử lý di chuyển lên
//     const handleMoveUp = (id: number) => {
//         setData((prevData) => {
//             const currentIndex = prevData.findIndex((item) => item.postmanForGradingId === id);
//             if (currentIndex > 0) {
//                 const newParentId = prevData[currentIndex - 1].postmanForGradingId;
//                 return prevData.map((item) =>
//                     item.postmanForGradingId === id
//                         ? { ...item, postmanForGradingParentId: newParentId }
//                         : item
//                 );
//             }
//             return prevData; // Không di chuyển nếu là item đầu tiên
//         });
//     };

//     // Xử lý di chuyển xuống
//     const handleMoveDown = (id: number) => {
//         setData((prevData) => {
//             const currentIndex = prevData.findIndex((item) => item.postmanForGradingId === id);
//             if (currentIndex < prevData.length - 1) {
//                 const newParentId = prevData[currentIndex + 1].postmanForGradingId;
//                 return prevData.map((item) =>
//                     item.postmanForGradingId === id
//                         ? { ...item, postmanForGradingParentId: newParentId }
//                         : item
//                 );
//             }
//             return prevData; // Không di chuyển nếu là item cuối cùng
//         });
//     };

//     // Hàm đệ quy để render cây
//     const renderTree = (
//         items: PostmanForGrading[],
//         parentId: number | null = null,
//         level: number = 0
//     ) => {
//         // Lọc các item là con của `parentId`
//         const children = items.filter((item) => item.postmanForGradingParentId === parentId);
    
//         return children.map((item) => (
//             <div
//                 key={item.postmanForGradingId}
//                 className="border border-gray-300 rounded-md bg-gray-50 mb-2 p-3"
//                 style={{
//                     paddingLeft: `${level * 20}px`, // Thụt lề theo cấp độ
//                 }}
//             >
//                 <div className="flex justify-between items-center">
//                     <div>
//                         <p className="font-semibold text-gray-700">{item.postmanFunctionName}</p>
//                         <p className="text-sm text-gray-600">
//                             Score: {item.scoreOfFunction}, Tests: {item.totalPmTest}
//                         </p>
//                     </div>
//                     <div className="flex space-x-2">
//                         <button
//                             onClick={() => handleMoveUp(item.postmanForGradingId)}
//                             className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
//                         >
//                             ↑
//                         </button>
//                         <button
//                             onClick={() => handleMoveDown(item.postmanForGradingId)}
//                             className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
//                         >
//                             ↓
//                         </button>
//                     </div>
//                 </div>
//                 {/* Gọi đệ quy để hiển thị các item con */}
//                 {renderTree(items, item.postmanForGradingId, level + 1)}
//             </div>
//         ));
//     };
    

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return <div>{renderTree(data)}</div>;
// };

// export default PostmanForGrading;
