import { useState, useEffect } from "react";
import { NoResultPage, ErrorPage } from "@/app/authentication/error/page";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import { CardPosition } from "./card-position";
import { CardRoleSkeleton } from "./card-position-sekeleton";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogCreatePosition } from "../create/dialog";
import { useNavigate } from "react-router-dom";

interface PositionProps {
  positionId: number;
  name: string;
  description: string;
  status: boolean;
  lastUpdated: string;
  totalUser: number;
}

async function getData(): Promise<PositionProps[]> {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("JWT Token không tồn tại. Vui lòng đăng nhập.");
  }

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.getAllPosition}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${await res.text()}`);
  }

  return res.json();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0"); // Đảm bảo luôn có 2 chữ số
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export default function Page({ reload }: { reload?: boolean }) {
  const [data, setData] = useState<PositionProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (reload) {
      getData()
        .then((positions) => {
          // Đảm bảo `lastUpdatedAt` được định dạng đúng
          const formattedRoles = positions.map((position) => ({
            ...position,
            lastUpdatedAt: formatDate(position.lastUpdated), // Định dạng ngày
          }));
          setData(formattedRoles);
        })
        .catch((err) => setError(err.message));
      navigate("/positions", { state: { reload: false } });
    } else {
      getData()
        .then((positions) => {
          // Đảm bảo `lastUpdatedAt` được định dạng đúng
          const formattedRoles = positions.map((position) => ({
            ...position,
            lastUpdatedAt: formatDate(position.lastUpdated), // Định dạng ngày
          }));
          setData(formattedRoles);
        })
        .catch((err) => setError(err.message));
    }
  }, [reload, navigate]);

  if (error) return <ErrorPage />;
  if (!data) return <CardRoleSkeleton />;
  if (data.length === 0) return <NoResultPage />;

  return (
    <div className="container mx-auto w-full border border-gray-200 p-8 rounded-lg">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Positions</h2>
          <p className="text-muted-foreground">
            Manage positions in the system!
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto text-primary border-primary rounded-full px-6"
            >
              Add New
            </Button>
          </DialogTrigger>
          <DialogCreatePosition />
        </Dialog>
      </div>
      <div className="grid grid-cols-3 gap-10 pt-10">
        {data.map((position) => (
          <CardPosition key={position.positionId} {...position} />
        ))}
      </div>
    </div>
  );
}
