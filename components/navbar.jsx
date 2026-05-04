// NavigationBar.jsx
import { useState, useEffect } from "react";

const NavigationBar = ({ showProfile, setShowProfile }) => {
  const [profile, setProfile] = useState(null);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    }
    const token = getCookie("auth_token");
    if (!token) return;

    const controller = new AbortController();

    Promise.allSettled([
      fetch(`https://isosofts.com/api/account/self?token=${encodeURIComponent(token)}`, { signal: controller.signal }).then(r => r.json()),
      fetch(`https://isosofts.com/api/company/self?token=${encodeURIComponent(token)}`, { signal: controller.signal }).then(r => r.json()),
    ]).then(([accResult, compResult]) => {
      if (accResult.status === "fulfilled") setProfile(accResult.value);
      if (compResult.status === "fulfilled") setCompanyName(compResult.value?.name || "");
    });

    return () => controller.abort();
  }, []);

  const displayName = profile?.fullName || profile?.name || "";
  const initials = companyName
    ? companyName.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
    : displayName
    ? displayName.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
    : "I";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Left — logo + nav links */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">I</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Isosofts
              </span>
            </div>

            <div className="hidden md:flex space-x-6">
              <a href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</a>
              <a href="" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Services</a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">About</a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Contact</a>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Company + user badge */}
            {profile && (companyName || displayName) && (
              <div className="hidden md:flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-3 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-white text-[10px] font-bold">{initials}</span>
                </div>
                <div className="leading-tight">
                  {companyName && (
                    <p className="text-[12px] font-semibold text-blue-800 leading-none">{companyName}</p>
                  )}
                  {displayName && (
                    <p className="text-[11px] text-blue-500 leading-none mt-0.5">{displayName}</p>
                  )}
                </div>
              </div>
            )}

            {/* Admin Panel button */}
            {profile?.isAdmin == 1 && (
              <a href="/admin">
                <button className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-800 transition-all shadow-md hover:shadow-lg">
                  <i className="fas fa-shield-alt text-xs" />
                  Admin Panel
                </button>
              </a>
            )}

            {/* Account / Login button */}
            <a href={profile ? "/profile" : "/los"}>
              <button
                onClick={() => setShowProfile?.(!showProfile)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all shadow-md hover:shadow-lg"
              >
                <i className="fas fa-user text-xs" />
                {profile ? (displayName || "Account") : "Login / Sign Up"}
              </button>
            </a>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
