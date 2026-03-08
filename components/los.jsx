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
    const response = await fetch("http://isosofts.com/api/account/login", {
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
    window.location.href = "https://algebra.isosofts.com/dashboard";

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
    const response = await fetch("http://isosofts.com/api/account/signup", {
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

    // ✅ Başarılı
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
        @keyframes blob1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(40px, -60px) scale(1.15); }
          66%       { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(-50px, 40px) scale(1.1); }
          66%       { transform: translate(35px, -25px) scale(0.95); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(30px, 50px) scale(0.9); }
          66%       { transform: translate(-40px, -30px) scale(1.2); }
        }
        @keyframes blob4 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%       { transform: translate(-25px, -45px) scale(1.1); }
        }
        @keyframes floatP {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0.4; }
          50%  { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
          100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
        }
        .blob1 { animation: blob1 9s ease-in-out infinite; }
        .blob2 { animation: blob2 11s ease-in-out infinite; }
        .blob3 { animation: blob3 13s ease-in-out infinite; }
        .blob4 { animation: blob4 7s ease-in-out infinite; }
        .blob5 { animation: blob2 15s ease-in-out infinite; }
        .fp1 { animation: floatP 4s ease-in-out infinite; }
        .fp2 { animation: floatP 5s ease-in-out infinite 0.8s; }
        .fp3 { animation: floatP 6s ease-in-out infinite 1.5s; }
        .fp4 { animation: floatP 4.5s ease-in-out infinite 2s; }
        .fp5 { animation: floatP 7s ease-in-out infinite 0.3s; }
        .fp6 { animation: floatP 5.5s ease-in-out infinite 1s; }
        .rounded-xl { border-radius: 1rem !important; }
        input:focus { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center p-6 pt-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 40%, #bfdbfe 70%, #f0f9ff 100%)" }}
      >
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="blob1 absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #3b82f6 0%, #1d4ed8 60%, transparent 100%)", filter: "blur(60px)" }} />
          <div className="blob2 absolute -top-20 right-0 w-80 h-80 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #60a5fa 0%, #2563eb 60%, transparent 100%)", filter: "blur(50px)" }} />
          <div className="blob3 absolute bottom-0 -left-20 w-72 h-72 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #93c5fd 0%, #3b82f6 60%, transparent 100%)", filter: "blur(55px)" }} />
          <div className="blob4 absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #1d4ed8 0%, #1e40af 50%, transparent 100%)", filter: "blur(70px)" }} />
          <div className="blob5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #bfdbfe 0%, #3b82f6 60%, transparent 100%)", filter: "blur(80px)" }} />

          {/* Floating dots */}
          <div className="fp1 absolute top-[15%] left-[10%] w-3 h-3 rounded-full bg-blue-400 opacity-40" />
          <div className="fp2 absolute top-[25%] right-[15%] w-2 h-2 rounded-full bg-blue-500 opacity-30" />
          <div className="fp3 absolute top-[60%] left-[20%] w-2 h-2 rounded-full bg-blue-300 opacity-50" />
          <div className="fp4 absolute top-[70%] right-[25%] w-3 h-3 rounded-full bg-blue-400 opacity-35" />
          <div className="fp5 absolute top-[40%] left-[5%] w-2 h-2 rounded-full bg-blue-600 opacity-25" />
          <div className="fp6 absolute top-[80%] right-[10%] w-2 h-2 rounded-full bg-blue-300 opacity-40" />

          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(#1d4ed8 1px, transparent 1px), linear-gradient(90deg, #1d4ed8 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }} />
        </div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                Isosofts
              </span>
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              {activeTab === "login" ? "Login to Your Account" : "Create Your Account"}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100/60 overflow-hidden">

            {/* Tab Switcher */}
            <div className="flex border-b border-gray-100">
              <button onClick={() => setActiveTab("login")}
                className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 ${activeTab === "login" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40" : "text-gray-500 hover:text-blue-500"}`}>
                Login
              </button>
              <button onClick={() => setActiveTab("signup")}
                className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 ${activeTab === "signup" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40" : "text-gray-500 hover:text-blue-500"}`}>
                Sign Up
              </button>
            </div>

            <div className="p-10">

              {/* LOGIN FORM */}
{activeTab === "login" && (
  <form onSubmit={handleSubmit} className="space-y-6">

    {/* Email */}
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        id="email" name="email" type="email"
        value={formData.email} onChange={handleChange}
        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40
          ${fieldErrors.email ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-blue-500"}`}
        placeholder="example@isosofts.com" required
      />
      {fieldErrors.email && (
        <p className="text-red-500 text-xs mt-1 ml-1">⚠ {fieldErrors.email}</p>
      )}
    </div>

    {/* Password */}
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input
        id="password" name="password" type="password"
        value={formData.password} onChange={handleChange}
        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40
          ${fieldErrors.password ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-blue-500"}`}
        placeholder="••••••••" required
      />
      {fieldErrors.password && (
        <p className="text-red-500 text-xs mt-1 ml-1">⚠ {fieldErrors.password}</p>
      )}
    </div>

    {/* Genel hata (yanlış şifre vs.) */}
    <div className="min-h-[44px]">
      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-xl">
          ⚠ {error}
        </div>
      )}
    </div>

    <button type="submit" disabled={loading}
      className={`w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mt-2
        ${loading ? "opacity-70 cursor-not-allowed" : "hover:from-blue-600 hover:to-blue-800"}`}>
      {loading ? "Processing..." : "Login"}
    </button>

  </form>
)}

              {/* SIGN UP FORM */}
{activeTab === "signup" && (
  <form onSubmit={handleSignUpSubmit} className="space-y-5">

    {/* Name & Surname */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input id="name" name="name" type="text" value={signUpData.name} onChange={handleSignUpChange}
          className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40
            ${signUpFieldErrors.name ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-blue-500"}`}
          placeholder="John" required />
        {signUpFieldErrors.name && (
          <p className="text-red-500 text-xs mt-1 ml-1">⚠ {signUpFieldErrors.name}</p>
        )}
      </div>
      <div>
        <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
        <input id="surname" name="surname" type="text" value={signUpData.surname} onChange={handleSignUpChange}
          className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40
            ${signUpFieldErrors.surname ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-blue-500"}`}
          placeholder="Doe" required />
        {signUpFieldErrors.surname && (
          <p className="text-red-500 text-xs mt-1 ml-1">⚠ {signUpFieldErrors.surname}</p>
        )}
      </div>
    </div>

    {/* Phone Number */}
    <div>
      <label htmlFor="signup-number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
      <input id="signup-number" name="number" type="tel" value={signUpData.number} onChange={handleSignUpChange}
        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40
          ${signUpFieldErrors.phoneNumber ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-blue-500"}`}
        placeholder="+90 555 000 00 00" required />
      {signUpFieldErrors.phoneNumber && (
        <p className="text-red-500 text-xs mt-1 ml-1">⚠ {signUpFieldErrors.phoneNumber}</p>
      )}
    </div>

    {/* Email */}
    <div>
      <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input id="signup-email" name="email" type="email" value={signUpData.email} onChange={handleSignUpChange}
        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40
          ${signUpFieldErrors.email ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-blue-500"}`}
        placeholder="example@isosofts.com" required />
      {signUpFieldErrors.email && (
        <p className="text-red-500 text-xs mt-1 ml-1">⚠ {signUpFieldErrors.email}</p>
      )}
    </div>

    {/* Company Name */}
    <div>
      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
      <input id="companyName" name="companyName" type="text" value={signUpData.companyName} onChange={handleSignUpChange}
        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40
          ${signUpFieldErrors.companyName ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-blue-500"}`}
        placeholder="Isosofts Ltd." required />
      {signUpFieldErrors.companyName && (
        <p className="text-red-500 text-xs mt-1 ml-1">⚠ {signUpFieldErrors.companyName}</p>
      )}
    </div>

    {/* Password */}
    <div>
      <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input id="signup-password" name="password" type="password" value={signUpData.password} onChange={handleSignUpChange}
        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40
          ${signUpFieldErrors.password ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-blue-500"}`}
        placeholder="••••••••" required />
      {signUpFieldErrors.password && (
        <p className="text-red-500 text-xs mt-1 ml-1">⚠ {signUpFieldErrors.password}</p>
      )}
    </div>

    {/* Confirm Password */}
    <div>
      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
      <input id="confirmPassword" name="confirmPassword" type="password" value={signUpData.confirmPassword} onChange={handleSignUpChange}
        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40
          ${signUpFieldErrors.confirmPassword ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-blue-500"}`}
        placeholder="••••••••" required />
      {signUpFieldErrors.confirmPassword && (
        <p className="text-red-500 text-xs mt-1 ml-1">⚠ {signUpFieldErrors.confirmPassword}</p>
      )}
    </div>

    {/* Genel hata / başarı mesajı */}
    <div className="min-h-[44px]">
      {signUpError && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-xl">⚠ {signUpError}</div>
      )}
      {signUpSuccess && (
        <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-xl">✓ Registration successful! You can now log in.</div>
      )}
    </div>

    <button type="submit" disabled={signUpLoading}
      className={`w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl
        ${signUpLoading ? "opacity-70 cursor-not-allowed" : "hover:from-blue-600 hover:to-blue-800"}`}>
      {signUpLoading ? "Processing..." : "Sign Up"}
    </button>

  </form>
)}

              {activeTab === "login" && (
                <div className="mt-10">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/80 text-gray-500">
                        If you have trouble logging in, please contact your Line Manager
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            © 2025 Isosofts. All Rights Reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthPage;