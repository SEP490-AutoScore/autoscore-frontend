import React, { useState, useRef } from "react";

interface PostmanItemProps {
    id: number;
    postman: string;
    onClick: (id: number) => void;
    onDoubleClick: (item: any) => void;
    isSelected: boolean;  // Thêm prop để kiểm tra xem khung này có được chọn không
    editingId: number | null;
    onSave: (id: number, content: string) => void;
    onCancel: () => void;
}
const PostmanItem: React.FC<PostmanItemProps> = ({
    id,
    postman,
    onClick,
    onDoubleClick,
    isSelected,
    editingId,
    onSave,
    onCancel,
}) => {
    const [postmanContent, setPostmanContent] = useState<string>(postman);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleClick = () => {
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
        }

        clickTimeoutRef.current = setTimeout(() => {
            onClick(id);  // Gọi onClick khi click 1 lần
        }, 10);
    };

    const handleDoubleClick = () => {
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
        }
        onDoubleClick({ id, postman });
    };

    return (
        <div
            className={`mb-4 p-4 bg-white border ${isSelected ? "border-orange-500" : "border-gray-300"
                } rounded-lg cursor-pointer ${editingId === id ? "h-full" : "h-96"
                }`} // "h-full" khi chỉnh sửa
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >

            <div className="flex flex-col h-full overflow-y-auto"> {/* Bật thanh cuộn dọc */}
                {editingId === id ? (
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={postmanContent}
                        onChange={(e) => setPostmanContent(e.target.value)}
                    />
                ) : (
                    <pre>{postman}</pre>
                )}
                {editingId === id && (
                    <div className="flex justify-end space-x-2 mt-2">
                        <button
                            className="text-sm p-2 bg-orange-500 text-white rounded-lg"
                            onClick={() => onSave(id, postmanContent)}
                        >
                            Save
                        </button>
                        <button
                            className="text-sm p-2 bg-gray-500 text-white rounded-lg"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

};

export default PostmanItem;
