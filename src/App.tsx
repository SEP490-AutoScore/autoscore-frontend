import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "@/routes/routes";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "./components/ui/toaster";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <Router>
          <AppRoutes />
        </Router>
        <Toaster />
      </UserProvider>
    </ToastProvider>
  );
}

export default App;
