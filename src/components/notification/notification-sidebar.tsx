import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Notification {
    notificationId: number;
    title: string;
    content: string;
    targetUrl: string;
    type: string;
    read: boolean;
}

export default function NotificationItem() {
    const [notifications, setNotifications] = useState<Notification[]>([]); // State lưu thông báo
    const [loading, setLoading] = useState<boolean>(true); // State hiển thị trạng thái tải dữ liệu

    // Hàm gọi API lấy thông báo
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("jwtToken"); // Lấy token từ localStorage

            const response = await fetch(`${BASE_URL}${API_ENDPOINTS.grading}`, {
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
            setNotifications(data); // Lưu danh sách thông báo
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Lọc thông báo chưa đọc
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer">
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                    <div className="flex aspect-square w-6 h-6 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                        {loading ? "..." : unreadCount}
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="start" side="bottom">
                <div className="p-2">
                    <h4 className="text-lg font-semibold">Notifications</h4>
                </div>
                {notifications.length === 0 ? (
                    <DropdownMenuItem>No notifications</DropdownMenuItem>
                ) : (
                    notifications.map((notification) => (
                        <DropdownMenuItem
                            key={notification.notificationId}
                            className={`flex flex-col items-start ${notification.read ? "opacity-50" : ""}`}
                            onClick={() => window.open(notification.targetUrl, "_blank")}
                        >
                            <span className="font-medium">{notification.title}</span>
                            <span className="text-sm text-muted-foreground">{notification.content}</span>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>

        </DropdownMenu>
    );
}
