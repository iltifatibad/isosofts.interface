import React, { useState } from "react";

const AuthPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // ------------------------------------------- LOGIN -----------------------------------------------
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setFieldErrors({});
  const dataToSend = { email: formData.email, password: formData.password };
  try {
    const response = await fetch("https://isosofts.com/api/account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const text = await response.text();
    let result;
    try { result = JSON.parse(text); } catch { throw new Error(`Server error: ${text.slice(0, 100)}`); }

    // 400 - Field bazlı validation hataları
    if (response.status === 400) {
      setFieldErrors(result.errors || {});
      return;
    }

    // Yanlış email veya şifre
    if (!response.ok) throw new Error(result.error || "Login failed");

    // ✅ Başarılı
    document.cookie = `auth_token=${result.token}; domain=.isosofts.com; path=/; max-age=86400; SameSite=Lax`;
    window.location.href = "https://algebra.isosofts.com/";

  } catch (err) {
    console.error("Error:", err);
    setError(err.message || "Could not connect to the server");
  } finally {
    setLoading(false);
  }
};
  // ------------------------------------------- LOGIN -----------------------------------------------


  const [activeTab, setActiveTab] = useState("login");
  const [fieldErrors, setFieldErrors] = useState({});
  const [signUpFieldErrors, setSignUpFieldErrors] = useState({});
  const [signUpData, setSignUpData] = useState({
    name: "", surname: "", number: "", email: "", companyName: "", password: "", confirmPassword: "",
  });
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
    setSignUpError(null);
  };

const handleSignUpSubmit = async (e) => {
  e.preventDefault();
  setSignUpLoading(true);
  setSignUpError(null);
  setSignUpSuccess(false);
  setSignUpFieldErrors({});

  const dataToSend = {
    name: signUpData.name,
    surname: signUpData.surname,
    phoneNumber: signUpData.number,
    email: signUpData.email,
    companyName: signUpData.companyName,
    password: signUpData.password,
    confirmPassword: signUpData.confirmPassword,
  };

  try {
    const response = await fetch("https://isosofts.com/api/account/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const text = await response.text();
    let result;
    try { result = JSON.parse(text); } catch { throw new Error(`Server error: ${text.slice(0, 100)}`); }

    // 400 - Field bazlı validation hataları
    if (response.status === 400) {
      setSignUpFieldErrors(result.errors || {});
      return;
    }

    if (!response.ok) throw new Error(result.message || "Registration failed");
    window.location.href = "https://isosofts.com/los";

    setSignUpSuccess(true);
    setSignUpData({ name: "", surname: "", number: "", email: "", companyName: "", password: "", confirmPassword: "" });

  } catch (err) {
    console.error("Error:", err);
    setSignUpError(err.message || "Could not connect to the server");
  } finally {
    setSignUpLoading(false);
  }
};
  return (
    <>
      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-60px) scale(1.15)} 66%{transform:translate(-30px,30px) scale(0.9)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-50px,40px) scale(1.1)} 66%{transform:translate(35px,-25px) scale(0.95)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,50px) scale(0.9)} 66%{transform:translate(-40px,-30px) scale(1.2)} }
        @keyframes blob4 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-25px,-45px) scale(1.1)} }
        .blob1{animation:blob1 9s ease-in-out infinite} .blob2{animation:blob2 11s ease-in-out infinite}
        .blob3{animation:blob3 13s ease-in-out infinite} .blob4{animation:blob4 7s ease-in-out infinite}
        input:focus{box-shadow:0 0 0 3px rgba(59,130,246,0.2)}
      `}</style>

      <div className="min-h-screen flex pt-16" style={{ background:"#f8fafc" }}>

        {/* LEFT — branding panel */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] flex-shrink-0 relative overflow-hidden p-12"
          style={{ background:"linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #0c2350 100%)" }}>

          {/* Grid texture */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"radial-gradient(circle at 1px 1px, rgba(59,130,246,0.07) 1px, transparent 0)", backgroundSize:"28px 28px" }} />
          {/* Glow orbs */}
          <div className="blob1" style={{ position:"absolute", top:"-10%", right:"-10%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)", pointerEvents:"none" }} />
          <div className="blob2" style={{ position:"absolute", bottom:"-10%", left:"-10%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents:"none" }} />

          {/* Top — logo */}
          <div className="relative z-10">
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:48 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#3b82f6,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 24px rgba(59,130,246,0.4)" }}>
                <span style={{ color:"#fff", fontWeight:800, fontSize:18 }}>I</span>
              </div>
              <span style={{ fontSize:22, fontWeight:800, color:"#fff" }}>Isosofts</span>
            </div>

            <h2 style={{ fontSize:32, fontWeight:800, color:"#fff", lineHeight:1.2, margin:"0 0 16px", letterSpacing:"-0.5px" }}>
              One platform.<br />Three ISO standards.
            </h2>
            <p style={{ fontSize:15, color:"rgba(148,163,184,0.85)", lineHeight:1.7, margin:"0 0 36px", maxWidth:360 }}>
              Manage your quality, environmental, and occupational health systems — all in one place.
            </p>

            {/* Feature bullets */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[
                { icon:"fa-layer-group",  text:"18+ integrated management modules" },
                { icon:"fa-chart-line",   text:"Real-time KPI & OPI dashboards" },
                { icon:"fa-file-excel",   text:"One-click Excel export for all data" },
                { icon:"fa-shield-halved",text:"Audit-ready compliance tracking" },
              ].map(f => (
                <div key={f.text} style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:"rgba(59,130,246,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <i className={`fas ${f.icon}`} style={{ fontSize:13, color:"#60a5fa" }} />
                  </div>
                  <span style={{ fontSize:14, color:"rgba(203,213,225,0.9)" }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — ISO badges */}
          <div className="relative z-10">
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["ISO 9001","ISO 14001","ISO 45001"].map(b => (
                <span key={b} style={{ padding:"4px 12px", borderRadius:99, border:"1px solid rgba(59,130,246,0.4)", color:"#93c5fd", fontSize:11, fontWeight:600, background:"rgba(59,130,246,0.1)" }}>{b}</span>
              ))}
            </div>
            <p style={{ fontSize:12, color:"rgba(100,116,139,0.7)", marginTop:16 }}>© {new Date().getFullYear()} Isosofts. All rights reserved.</p>
          </div>
        </div>

        {/* RIGHT — form panel */}
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
          {/* Subtle bg blobs for mobile */}
          <div className="blob3 absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-20 lg:hidden"
            style={{ background:"radial-gradient(circle,#3b82f6 0%,#1d4ed8 60%,transparent 100%)", filter:"blur(60px)" }} />
          <div className="blob4 absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15 lg:hidden"
            style={{ background:"radial-gradient(circle,#60a5fa 0%,#2563eb 60%,transparent 100%)", filter:"blur(60px)" }} />

          <div className="relative z-10 w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Isosofts</h1>
              <p className="text-gray-500 mt-2">{activeTab === "login" ? "Login to your account" : "Create your account"}</p>
            </div>

            {/* Desktop heading */}
            <div className="hidden lg:block mb-8">
              <h3 style={{ fontSize:26, fontWeight:800, color:"#1e3a5f", margin:"0 0 6px" }}>
                {activeTab === "login" ? "Welcome back" : "Create account"}
              </h3>
              <p style={{ fontSize:14, color:"#64748b", margin:0 }}>
                {activeTab === "login" ? "Sign in to access your workspace" : "Get started with Isosofts today"}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Tab Switcher */}
              <div className="flex border-b border-gray-100">
                <button onClick={() => setActiveTab("login")}
                  className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 ${activeTab==="login" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40" : "text-gray-500 hover:text-blue-500"}`}>
                  Login
                </button>
                <button onClick={() => setActiveTab("signup")}
                  className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 ${activeTab==="signup" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40" : "text-gray-500 hover:text-blue-500"}`}>
                  Sign Up
                </button>
              </div>

              <div className="p-8">
                {/* LOGIN FORM */}
                {activeTab === "login" && (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all bg-gray-50 ${fieldErrors.email ? "border-red-400" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`}
                        placeholder="example@company.com" required />
                      {fieldErrors.email && <p className="text-red-500 text-xs mt-1">⚠ {fieldErrors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input id="password" name="password" type="password" value={formData.password} onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all bg-gray-50 ${fieldErrors.password ? "border-red-400" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`}
                        placeholder="••••••••" required />
                      {fieldErrors.password && <p className="text-red-500 text-xs mt-1">⚠ {fieldErrors.password}</p>}
                    </div>
                    {error && <div className="text-red-600 text-sm bg-red-50 border border-red-100 p-3 rounded-xl">⚠ {error}</div>}
                    <button type="submit" disabled={loading}
                      className={`w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all shadow-md ${loading ? "opacity-70 cursor-not-allowed bg-blue-400" : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 hover:shadow-lg"}`}>
                      {loading ? <><i className="fas fa-circle-notch animate-spin mr-2" />Signing in...</> : "Sign In"}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2">Having trouble? Contact your Line Manager</p>
                  </form>
                )}

                {/* SIGN UP FORM */}
                {activeTab === "signup" && (
                  <form onSubmit={handleSignUpSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input name="name" type="text" value={signUpData.name} onChange={handleSignUpChange}
                          className={`w-full px-4 py-3 rounded-xl border outline-none bg-gray-50 transition-all ${signUpFieldErrors.name ? "border-red-400" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`}
                          placeholder="John" required />
                        {signUpFieldErrors.name && <p className="text-red-500 text-xs mt-1">⚠ {signUpFieldErrors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
                        <input name="surname" type="text" value={signUpData.surname} onChange={handleSignUpChange}
                          className={`w-full px-4 py-3 rounded-xl border outline-none bg-gray-50 transition-all ${signUpFieldErrors.surname ? "border-red-400" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`}
                          placeholder="Doe" required />
                        {signUpFieldErrors.surname && <p className="text-red-500 text-xs mt-1">⚠ {signUpFieldErrors.surname}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input name="number" type="tel" value={signUpData.number} onChange={handleSignUpChange}
                        className={`w-full px-4 py-3 rounded-xl border outline-none bg-gray-50 transition-all ${signUpFieldErrors.phoneNumber ? "border-red-400" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`}
                        placeholder="+994 50 000 00 00" required />
                      {signUpFieldErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">⚠ {signUpFieldErrors.phoneNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input name="email" type="email" value={signUpData.email} onChange={handleSignUpChange}
                        className={`w-full px-4 py-3 rounded-xl border outline-none bg-gray-50 transition-all ${signUpFieldErrors.email ? "border-red-400" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`}
                        placeholder="example@company.com" required />
                      {signUpFieldErrors.email && <p className="text-red-500 text-xs mt-1">⚠ {signUpFieldErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input name="companyName" type="text" value={signUpData.companyName} onChange={handleSignUpChange}
                        className={`w-full px-4 py-3 rounded-xl border outline-none bg-gray-50 transition-all ${signUpFieldErrors.companyName ? "border-red-400" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`}
                        placeholder="Your Company Ltd." required />
                      {signUpFieldErrors.companyName && <p className="text-red-500 text-xs mt-1">⚠ {signUpFieldErrors.companyName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input name="password" type="password" value={signUpData.password} onChange={handleSignUpChange}
                          className={`w-full px-4 py-3 rounded-xl border outline-none bg-gray-50 transition-all ${signUpFieldErrors.password ? "border-red-400" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`}
                          placeholder="••••••••" required />
                        {signUpFieldErrors.password && <p className="text-red-500 text-xs mt-1">⚠ {signUpFieldErrors.password}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                        <input name="confirmPassword" type="password" value={signUpData.confirmPassword} onChange={handleSignUpChange}
                          className={`w-full px-4 py-3 rounded-xl border outline-none bg-gray-50 transition-all ${signUpFieldErrors.confirmPassword ? "border-red-400" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`}
                          placeholder="••••••••" required />
                        {signUpFieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">⚠ {signUpFieldErrors.confirmPassword}</p>}
                      </div>
                    </div>
                    {signUpError && <div className="text-red-600 text-sm bg-red-50 border border-red-100 p-3 rounded-xl">⚠ {signUpError}</div>}
                    {signUpSuccess && <div className="text-green-600 text-sm bg-green-50 border border-green-100 p-3 rounded-xl">✓ Registration successful! You can now log in.</div>}
                    <button type="submit" disabled={signUpLoading}
                      className={`w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all shadow-md ${signUpLoading ? "opacity-70 cursor-not-allowed bg-blue-400" : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 hover:shadow-lg"}`}>
                      {signUpLoading ? <><i className="fas fa-circle-notch animate-spin mr-2" />Creating account...</> : "Create Account"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;