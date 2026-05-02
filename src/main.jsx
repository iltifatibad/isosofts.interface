import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Router import'ları eklendi
import "./index.css";
import Mai from "../components/mainpage.jsx";
import Nav from "../components/navbar.jsx";
import AuthPage from "../components/los.jsx"
import UserProfile from "../components/userprofile.jsx";
import AdminDashboard from "../components/admin.jsx";
import SuperAdminDashboard from "../components/superAdmin.jsx";
import HelpEditor from "../components/HelpEditor.jsx";
import IntroScreen from "../components/IntroScreen.jsx";

import React, { useState, useEffect } from "react";


function App() {
  const [introDone, setIntroDone] = useState(false);

  createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      {!introDone && <IntroScreen onDone={() => setIntroDone(true)} />}
      <Nav />
      <Routes>
        <Route path="/" element={<Mai />} />
        <Route path="/los" element={<AuthPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/superAdmin" element={<SuperAdminDashboard />} />
        <Route path="/help-editor" element={<HelpEditor />} />
      </Routes>
    </BrowserRouter>,
  );
}

createRoot(document.getElementById("root")).render(<App />);
