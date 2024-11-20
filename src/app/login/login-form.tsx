import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/assets/autoscore_logo.png";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { useCookie } from "@/hooks/use-cookie";

interface AuthResponse {
  email: string;
  name: string;
  role: string;
  position: string;
  campus: string;
  jwtToken: string;
  refreshToken: string;
  permissions: string[];
  exp: number;
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToastNotification();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const picture = searchParams.get("picture");
  const { setCookie, deleteCookie } = useCookie();

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = `${BASE_URL}${API_ENDPOINTS.oauthGoogle}`;
  };

  useEffect(() => {
    if (email && picture) {
      // Lưu thông tin vào localStorage
      localStorage.setItem("email", email);
      localStorage.setItem("picture", picture);

      // Gọi API để hoàn tất xác thực
      fetch(`${BASE_URL}${API_ENDPOINTS.signInGoogle}?email=${email}`)
        .then(async (res) => {
          if (!res.ok) {
            // Nếu không thành công, ném lỗi
            throw new Error(`HTTP Error: ${res.status}`);
          }
          const data: AuthResponse = await res.json();
          // Lưu vào localStorage
          Object.entries(data).forEach(([key, value]) =>{
            if (key === "refreshToken") {
              setCookie(key, value, data.exp);
            } else if (key === "exp") {
              const expire = Date.now() + data.exp;
              localStorage.setItem(key, String(expire));
            }
             else {
              localStorage.setItem(key, value)
            }
        });

          // Chuyển đến dashboard
          window.location.href = "/dashboard";
        })
        .catch((error) => {

          // Hiển thị toast dựa trên mã lỗi
          if (error.message.includes("401") || error.message.includes("404")) {
            showToast({
              title: "Authentication Failed.",
              description: "You are not authorized to sign in.",
              actionText: "Try Again",
              variant: "destructive",
            });
          } else if (error.message.includes("400")) {
            showToast({
              title: "Bad Request.",
              description: "There was a problem with your request.",
              variant: "destructive",
            });
          } else if (error.message.includes("500")) {
            showToast({
              title: "Internal Server Error.",
              description: "Something went wrong on the server.",
              variant: "destructive",
            });
          } else {
            showToast({
              title: "Something went wrong.",
              description: "There was a problem with your request.",
              variant: "destructive",
            });
          }
          localStorage.clear();
          deleteCookie("refreshToken");
        });
    }
  }, [email, picture, showToast, setCookie, deleteCookie]);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <div className="flex w-full items-center justify-center">
          <img src={Logo} alt="Logo" className="size-20" />
        </div>
        <CardTitle className="text-2xl text-center">
          Welcome to AutoScore
        </CardTitle>
        <CardDescription className="text-center">
          FPT University&apos;s Automated Scoring System
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff8e29]"
          >
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          <p className="text-center text-sm text-gray-600">
            By signing in, you agree to Auto Score&apos;s{" "}
            <a href="#" className="font-medium text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-primary">
              Privacy Policy
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
