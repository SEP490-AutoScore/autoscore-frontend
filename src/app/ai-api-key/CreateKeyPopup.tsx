import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";


export const CreateKeyPopup = ({ onClose }: any) => {
    const notify = useToastNotification();
    // Form mặc định với aiName là "GEMINI"
    const [form, setForm] = useState({
        aiName: "GEMINI", // Giá trị mặc định
        aiApiKey: "",
        shared: false, // Mặc định là false
    });

    // Hàm xử lý thay đổi input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        if (!form.aiApiKey.trim()) {

            notify({
                title: "Error",
                description: "API Key cannot be empty!",
                variant: "destructive",
            });
            return;
        }

        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                alert("JWT token not found.");
                return;
            }

            // Gửi dữ liệu tới API để tạo API key
            const response = await fetch(`${BASE_URL}${API_ENDPOINTS.createAiApiKeys}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.aiApiKeyId) {
                    // Nếu response chứa aiApiKeyId thì thông báo thành công
                    notify({
                        title: "Success",
                        description: `API Key created successfully! ID: ${responseData.aiApiKeyId}`,
                        variant: "default",
                    });
                }
                onClose(); // Đóng popup
            } else {
                const errorData = await response.json();
                notify({
                    title: "Error",
                    description: errorData.message || "Failed to create API Key.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error creating API Key:", error);
            notify({
                title: "Error",
                description: "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Create New API Key</h2>
                <div className="space-y-4">
                    {/* AI Name */}
                    <div>
                        <label className="block text-sm font-medium">AI Name</label>
                        <input
                            type="text"
                            name="aiName"
                            value={form.aiName}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                            disabled // Không cho phép chỉnh sửa
                        />
                    </div>

                    {/* API Key */}
                    <div>
                        <label className="block text-sm font-medium">API Key</label>
                        <input
                            type="text"
                            name="aiApiKey"
                            value={form.aiApiKey}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                            placeholder="Enter API Key"
                        />
                    </div>

                    {/* Is Shared */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="shared"
                            checked={form.shared}
                            onChange={handleChange}
                            id="shared-checkbox"
                            className="peer h-5 w-5 border-2 border-gray-300 rounded-md checked:bg-orange-500 checked:border-orange-500 transition-all duration-200"
                        />
                        <label
                            htmlFor="shared-checkbox"
                            className="text-sm peer-checked:text-orange-500 transition-all duration-200"
                        >
                            Is Shared
                        </label>
                    </div>


                </div>

                {/* Buttons */}
                <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Create</Button>
                </div>
            </div>
        </div>
    );
};
