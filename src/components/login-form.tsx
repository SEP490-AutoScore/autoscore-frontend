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
import Logo from "../assets/autoscore_logo.png";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

interface AuthResponse {
  email: string;
  name: string;
  role: string;
  position: string;
  campus: string;
  jwtToken: string;
  refreshToken: string;
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const picture = searchParams.get("picture");
  console.log("Search Params:", Object.fromEntries(searchParams.entries()));
  console.log("URL Params: Email =", email, "Picture =", picture);
  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = `${BASE_URL}${API_ENDPOINTS.oauthGoogle}`;
  };

  useEffect(() => {
    if (email && picture) {
      console.log("Detected email and picture:", email, picture);

      // Lưu thông tin vào localStorage
      localStorage.setItem("email", email);
      localStorage.setItem("picture", picture);

      // Gọi API để hoàn tất xác thực
      fetch(`${BASE_URL}${API_ENDPOINTS.signInGoogle}?email=${email}`)
        .then(async (res) => {
          console.log("API Response:", res.status); // Kiểm tra status của phản hồi
          if (res.ok) {
            const data: AuthResponse = await res.json();
            console.log("Auth Data:", data); // Log dữ liệu từ API
            // Lưu vào localStorage
            Object.entries(data).forEach(([key, value]) =>
              localStorage.setItem(key, value)
            );

            // Chuyển đến dashboard
            window.location.href = "/dashboard";
          } else {
            throw new Error(`Failed to sign in: ${res.status}`);
          }
        })
        .catch((error) => {
          console.error("Error during sign-in:", error); // Log lỗi
          alert("An error occurred during authentication. Please try again.");
          localStorage.clear();
        });
    }
  }, [email, picture]);

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
