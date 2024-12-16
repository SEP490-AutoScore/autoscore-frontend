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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/assets/autoscore_logo.png";
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";
import { useToastNotification } from "@/hooks/use-toast-notification";
import { useCookie } from "@/hooks/use-cookie";

interface AuthResponse {
  id: number;
  email: string;
  name: string;
  avatar: string;
  role: string;
  position: string;
  campus: string;
  jwtToken: string;
  refreshToken: string;
  permissions: string[];
  exp: number;
  password: string;
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const showToast = useToastNotification();
  const [searchParams] = useSearchParams();
  const googleEmail = searchParams.get("email");
  const { setCookie, deleteCookie } = useCookie();

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = `${BASE_URL}${API_ENDPOINTS.oauthGoogle}`;
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Fake API call for email/password login
    try {
      fetch(`${BASE_URL}${API_ENDPOINTS.signInEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            // Nếu không thành công, ném lỗi
            throw new Error(`HTTP Error: ${res.status}`);
          }
          const data: AuthResponse = await res.json();
          // Lưu vào localStorage
          Object.entries(data).forEach(([key, value]) => {
            if (key === "refreshToken") {
              setCookie(key, value, data.exp);
            } else if (key === "exp") {
              localStorage.setItem(key, data.exp.toString());
            } else {
              localStorage.setItem(key, value);
            }
          });

          // Chuyển đến dashboard
          window.location.href =
            localStorage.getItem("selectedItem") || "/dashboard";
        })
        .catch((error) => {
          // Hiển thị toast dựa trên mã lỗi
          if (error.message.includes("401") || error.message.includes("403")) {
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
          } else if (error.message.includes("404")) {
            showToast({
              title: "Login Failed",
              description: "Invalid email or password",
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
    } catch (error) {
      console.error("Login failed:", error);
      showToast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (googleEmail) {
      // Lưu thông tin vào localStorage
      localStorage.setItem("email", googleEmail);

      // Gọi API để hoàn tất xác thực
      fetch(`${BASE_URL}${API_ENDPOINTS.signInGoogle}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: googleEmail,
      })
        .then(async (res) => {
          if (!res.ok) {
            // Nếu không thành công, ném lỗi
            throw new Error(`HTTP Error: ${res.status}`);
          }
          const data: AuthResponse = await res.json();
          // Lưu vào localStorage
          Object.entries(data).forEach(([key, value]) => {
            if (key === "refreshToken") {
              setCookie(key, value, data.exp);
            } else if (key === "exp") {
              localStorage.setItem(key, data.exp.toString());
            } else {
              localStorage.setItem(key, value);
            }
          });

          // Chuyển đến dashboard
          window.location.href =
            localStorage.getItem("selectedItem") || "/dashboard";
        })
        .catch((error) => {
          // Hiển thị toast dựa trên mã lỗi
          if (error.message.includes("401") || error.message.includes("403")) {
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
          } else if (error.message.includes("404")) {
            showToast({
              title: "Login Failed",
              description: "Your email is not registered",
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
  }, [email, showToast, setCookie, deleteCookie, googleEmail]);

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
          FPT University's Automated Scoring System
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full border-2 border-primary bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground
            font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform
            hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in with Email"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">OR</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          variant="outline"
          className="w-full border-2 border-primary bg-white hover:bg-primary text-primary hover:text-primary-foreground
          font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform
          hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4]"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          Sign in with Google
        </Button>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            By signing in, you agree to Auto Score's{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
