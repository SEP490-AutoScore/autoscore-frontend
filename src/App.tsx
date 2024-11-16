import "./App.css";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
import  Page from "./app/dashboard/page";
// import { AppSidebar } from "@/components/app-sidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import { Routes, Route } from "react-router-dom";

// function RoutesWrapper() {
//   const routes = useRoutes(); // Now this is within RouteProvider

//   return (
//     <Routes>
//     </Routes>
//   );

// }

function App() {
  return (
    <div className="App">
          <Page />
    </div>
  );
}
export default App;
