import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { CommandShortcut } from "@/components/ui/command";

export default function NotificationItem() {
    const [unreadCount, setUnreadCount] = useState<number>(0); // State lưu số lượng thông báo chưa đọc
    const [loading, setLoading] = useState<boolean>(true); // State hiển thị trạng thái tải dữ liệu

    // Hàm gọi API lấy thông báo chưa đọc
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("jwtToken"); // Lấy token từ localStorage

            const response = await fetch("http://localhost:8080/api/notifications", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Thêm JWT token vào header
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            const unreadNotifications = data.filter((notification: { read: boolean }) => !notification.read); // Lọc ra thông báo chưa đọc
            setUnreadCount(unreadNotifications.length); // Đếm số lượng thông báo chưa đọc
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            setUnreadCount(0); // Nếu có lỗi, đặt lại số lượng thông báo là 0
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
            <CommandShortcut>
                <div className="flex aspect-square w-6 h-6 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                    {loading ? "..." : unreadCount} {/* Hiển thị số lượng thông báo chưa đọc */}
                </div>
            </CommandShortcut>
        </div>
    );
}
