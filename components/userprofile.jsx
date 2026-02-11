import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@isosofts.com",
    employeeId: "EMP-7842",
    department: "Quality Assurance",
    position: "Senior Quality Engineer",
    lineManager: {
      name: "Sarah Mitchell",
      email: "sarah.mitchell@isosofts.com",
      position: "Quality Assurance Manager"
    },
    joinDate: "March 15, 2022",
    lastLogin: "February 11, 2026 08:45 AM",
    phone: "+90 555 123 45 67",
    location: "Istanbul Office"
  });

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

    if (passwordForm.newPassword.length < 8) {
      setMessage({ text: "New password must be at least 8 characters", type: "error" });
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

  // In real app you would fetch real data here
  useEffect(() => {
    // fetch("http://localhost:8000/api/user/profile")
    //   .then(res => res.json())
    //   .then(data => {
    //     setProfile(data.profile);
    //     setSubordinates(data.subordinates || []);
    //   });
  }, []);

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
                    {profile.fullName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{profile.fullName}</h2>
                    <p className="text-blue-100 mt-1">{profile.position}</p>
                    <p className="text-blue-200 mt-1">{profile.department}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Employee ID</label>
                    <p className="mt-1 text-gray-900 font-medium">{profile.employeeId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-gray-900 font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="mt-1 text-gray-900 font-medium">{profile.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Location</label>
                    <p className="mt-1 text-gray-900 font-medium">{profile.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Join Date</label>
                    <p className="mt-1 text-gray-900 font-medium">{profile.joinDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Login</label>
                    <p className="mt-1 text-gray-900 font-medium">{profile.lastLogin}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Manager */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Line Manager</h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                  {profile.lineManager.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-lg">{profile.lineManager.name}</p>
                  <p className="text-gray-600">{profile.lineManager.position}</p>
                  <p className="text-blue-600 mt-1">{profile.lineManager.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Password Change & Subordinates */}
          <div className="space-y-8">
            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Change Password</h3>
              
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
                  <div className={`p-3 rounded-lg text-sm ${
                    message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
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