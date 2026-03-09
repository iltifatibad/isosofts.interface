// NavigationBar.jsx
import React, { useState, useEffect } from "react";

const NavigationBar = ({ showProfile, setShowProfile }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }
    const token = getCookie('auth_token');
    if (!token) {
      console.warn("Auth token cookie'de bulunamadı");
      return;
    }
    console.log("Token bulundu:", token.substring(0, 20) + "...");
    fetch(`http://isosofts.com/api/account/self?token=${encodeURIComponent(token)}`)
      .then(res => {
        console.log("İstek status:", res.status);
        if (!res.ok) {
          throw new Error(`Sunucu hatası: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Backend'den gelen veri:", data);
        setProfile(data);
      })
      .catch(err => {
        console.error("Profil hatası:", err);
      });
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-pulse">
              Isosofts
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="/" className="nav-link text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                Home
              </a>
              <a href="" data-readdy="true" className="nav-link text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                Services
              </a>
              <a href="#" className="nav-link text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                About
              </a>
              <a href="#" className="nav-link text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                Contact
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {profile && profile.isAdmin == 1 && (
              <a href="/admin">
                <button className="rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 hover:from-red-600 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <i className="fas fa-shield-alt mr-2"></i>Admin Panel
                </button>
              </a>
            )}
            <a href="/los">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="rounded-button whitespace-nowrap cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-user mr-2"></i>
                {profile ? profile.name : "Login / SignUp"}
              </button>
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;