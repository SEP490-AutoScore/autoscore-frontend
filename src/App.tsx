import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "@/routes/routes";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppRoutes />
      </Router>
      <Toaster />
    </ToastProvider>
  );
}

export default App;