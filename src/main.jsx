import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Router import'ları eklendi
import "./index.css";
import Mai from "../components/mainpage.jsx";
import Nav from "../components/navbar.jsx";
import AuthPage from "../components/los.jsx"
import UserProfile from "../components/userprofile.jsx";
import AdminDashboard from "../components/admin.jsx";


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Nav />
    <Routes>
      <Route path="/" element={<Mai />} />
      <Route path="/los" element={<AuthPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  </BrowserRouter>,
);
