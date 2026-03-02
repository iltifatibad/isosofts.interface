import React, { useState } from "react";

const AuthPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSend = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      console.log("Login successful:", result);

      // Handle successful login (example):
      // localStorage.setItem("token", result.token);
      // window.location.href = "/dashboard";

    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Could not connect to the server");
    } finally {
      setLoading(false);
    }
  };

  // ─── Sign Up State (NEW) ───────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("login");

  const [signUpData, setSignUpData] = useState({
    name: "",
    surname: "",
    number: "",
    email: "",
    companyName: "",
    password: "",
    confirmPassword: "",
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

    if (signUpData.password !== signUpData.confirmPassword) {
      setSignUpError("Passwords do not match.");
      setSignUpLoading(false);
      return;
    }

    const dataToSend = {
      name: signUpData.name,
      surname: signUpData.surname,
      number: signUpData.number,
      email: signUpData.email,
      companyName: signUpData.companyName,
      password: signUpData.password,
    };

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      console.log("Registration successful:", result);
      setSignUpSuccess(true);
      setSignUpData({
        name: "",
        surname: "",
        number: "",
        email: "",
        companyName: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error:", err);
      setSignUpError(err.message || "Could not connect to the server");
    } finally {
      setSignUpLoading(false);
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
          backgroundBlendMode: "soft-light",
        }}
      ></div>

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

        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100/60 overflow-hidden">

          {/* ─── Tab Switcher (NEW) ─────────────────────────────────────────── */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-4 text-sm font-semibold transition-all duration-200
                ${activeTab === "login"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40"
                  : "text-gray-500 hover:text-blue-500"
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-4 text-sm font-semibold transition-all duration-200
                ${activeTab === "signup"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40"
                  : "text-gray-500 hover:text-blue-500"
                }`}
            >
              Sign Up
            </button>
          </div>
          {/* ────────────────────────────────────────────────────────────────── */}

          <div className="p-10">

            {/* ─── LOGIN FORM (original — untouched) ──────────────────────── */}
            {activeTab === "login" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40"
                    placeholder="example@isosofts.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="min-h-[44px]">
                  {error && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-xl">
                      {error}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mt-2
                    ${loading ? "opacity-70 cursor-not-allowed" : "hover:from-blue-600 hover:to-blue-800"}`}
                >
                  {loading ? "Processing..." : "Login"}
                </button>
              </form>
            )}
            {/* ────────────────────────────────────────────────────────────── */}

            {/* ─── SIGN UP FORM (NEW) ──────────────────────────────────────── */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignUpSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={signUpData.name}
                      onChange={handleSignUpChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                      Surname
                    </label>
                    <input
                      id="surname"
                      name="surname"
                      type="text"
                      value={signUpData.surname}
                      onChange={handleSignUpChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-number" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="signup-number"
                    name="number"
                    type="tel"
                    value={signUpData.number}
                    onChange={handleSignUpChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40"
                    placeholder="+90 555 000 00 00"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    value={signUpData.email}
                    onChange={handleSignUpChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40"
                    placeholder="example@isosofts.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={signUpData.companyName}
                    onChange={handleSignUpChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40"
                    placeholder="Isosofts Ltd."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    value={signUpData.password}
                    onChange={handleSignUpChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={signUpData.confirmPassword}
                    onChange={handleSignUpChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50/40"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="min-h-[44px]">
                  {signUpError && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-xl">
                      {signUpError}
                    </div>
                  )}
                  {signUpSuccess && (
                    <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-xl">
                      Registration successful! You can now log in.
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={signUpLoading}
                  className={`w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mt-2
                    ${signUpLoading ? "opacity-70 cursor-not-allowed" : "hover:from-blue-600 hover:to-blue-800"}`}
                >
                  {signUpLoading ? "Processing..." : "Sign Up"}
                </button>
              </form>
            )}
            {/* ────────────────────────────────────────────────────────────── */}

            {activeTab === "login" && (
              <div className="mt-10">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
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
  );
};

const globalStyles = `
  .rounded-xl {
    border-radius: 1rem !important;
  }
  input:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = globalStyles;
  document.head.appendChild(style);
}

export default AuthPage;