import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [lineManager, setLineManager] = useState(null);
  const [subordinates, setSubordinates] = useState([
    { id: "EMP-9123", name: "Ahmet Yılmaz", position: "Quality Engineer", email: "ahmet.yilmaz@isosofts.com" },
    { id: "EMP-4567", name: "Elif Kaya", position: "Junior Quality Specialist", email: "elif.kaya@isosofts.com" },
    { id: "EMP-2891", name: "Murat Demir", position: "Quality Technician", email: "murat.demir@isosofts.com" }
  ]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [message, setMessage] = useState({ text: "", type: "success" });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "success" });

    try {
      // Simulate API call
      // await fetch("http://localhost:8000/api/user/change-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     current: passwordForm.currentPassword,
      //     new: passwordForm.newPassword
      //   })
      // });

      // For demo:
      await new Promise(resolve => setTimeout(resolve, 1200));

      setMessage({ text: "Password changed successfully", type: "success" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
    } catch (err) {
      setMessage({ text: "Failed to change password. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

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
    window.location.href = "http://isosofts.com/los";
    return;
  }

  fetch(`http://isosofts.com/api/account/self?token=${encodeURIComponent(token)}`)
    .then(res => {
      if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);
      return res.json();
    })
    .then(data => {
      setProfile(data);
      setSubordinates(data.subordinates || []);

      if (data.lineManagerId) {
        fetch(`http://isosofts.com/api/account/staff/${data.lineManagerId}?token=${encodeURIComponent(token)}`)
          .then(res => {
            if (!res.ok) throw new Error(`Line manager hatası: ${res.status}`);
            return res.json();
          })
          .then(lm => setLineManager(lm))
          .catch(err => console.error("Line manager fetch hatası:", err));
      }
    })
    .catch(err => console.error("Profil hatası:", err));
}, []);




  // ✅ DÜZELTME: profile null iken render etme
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mt-10">
          <h1 className="text-4xl font-bold text-gray-800">
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">
            ISOSofts 9001 CRM • Quality Management System
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Main Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-10 text-white">
            <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-blue-700">
            {profile.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
            <h2 className="text-3xl font-bold">{profile.name} {profile.surname}</h2>
            {/* <p className="text-blue-100 mt-1">{profile.position}</p>
                                <p className="text-blue-200 mt-1">{profile.department}</p> */}
            </div>
            </div>
            </div>
            <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label className="block text-sm font-medium text-gray-500">Account</label>
            <p className="mt-1 text-gray-900 font-medium">{profile.isActive === 1 ? "Active" : "Deactive"}</p>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-gray-900 font-medium">{profile.email}</p>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-500">Phone</label>
            <p className="mt-1 text-gray-900 font-medium">{profile.phoneNumber}</p>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-500">Location</label>
            <p className="mt-1 text-gray-900 font-medium">Azerbaijan, Baku</p>
            </div>
            <div>
            {/* <label className="block text-sm font-medium text-gray-500">Join Date</label> */}
            {/* <p className="mt-1 text-gray-900 font-medium">{profile.joinDate}</p> */}
            </div>
            <div>
            {/* <label className="block text-sm font-medium text-gray-500">Last Login</label> */}
            {/* <p className="mt-1 text-gray-900 font-medium">{profile.lastLogin}</p> */}
            </div>
            </div>
            </div>
            </div>
            {/* Line Manager */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Line Manager</h3>
            <div className="flex items-start space-x-4">
            {lineManager ? (
            <>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-md flex-shrink-0">
            {lineManager.name?.[0]?.toUpperCase()}{lineManager.surname?.[0]?.toUpperCase()}
            </div>
            <div>
            <p className="font-semibold text-lg text-gray-800">{lineManager.name} {lineManager.surname}</p>
            <a href={"mailto:" + lineManager.email} className="text-blue-500 hover:text-blue-700 text-sm mt-1 inline-flex items-center gap-1 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {lineManager.email}
            </a>
            </div>
            </>
            ) : (
            <>
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            </div>
            <div className="flex items-center h-16">
            <p className="text-sm text-gray-400 italic">No line manager assigned</p>
            </div>
            </>
            )}
            </div>
            </div>
            </div>

          {/* Right Column - Password Change & Subordinates */}
          <div className="space-y-8">
            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Change Password</h3>
              {Number(profile.isAdmin) === 0 && (
                <h2 className="text-ml font-bold text-gray-800 mb-6">
                  If You Want to Change Your Password, Contact the Admin
                </h2>
              )}

              {/* {Number(profile.isAdmin) === 1 && (
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={passwordForm.confirmNewPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      required
                    />
                  </div>

                  {message.text && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        message.type === "success"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? "Changing..." : "Update Password"}
                  </button>
                </form>
              )} */}
            </div>

            {/* Subordinates (if manager) */}
            {subordinates.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Team Members</h3>
                <div className="space-y-4">
                  {subordinates.map((person) => (
                    <div key={person.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-gray-600">{person.position}</p>
                      </div>
                      <a 
                        href={`mailto:${person.email}`} 
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Contact
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;