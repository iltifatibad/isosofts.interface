import React, { useState, useEffect } from "react";

const SuperAdminDashboard = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ password1: "", password2: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // Modal states
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);

  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showCopyRegistryModal, setShowCopyRegistryModal] = useState(false);
  const [showAddRegistryModal, setShowAddRegistryModal] = useState(false);
  const [showEditRegistryModal, setShowEditRegistryModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subordinates, setSubordinates] = useState([]);

  const [accessModal, setAccessModal] = useState({ open: false, emp: null });
  const [empAccesses, setEmpAccesses] = useState([]);
  const [accessLoading, setAccessLoading] = useState(false);
  const REGISTERS = [
    { key: "kpi", label: "Key Performance Indicators" },
    { key: "br",  label: "Context of Organisation, Business Risks, Opportunities & Objectives Register" },
    { key: "hsr", label: "Health & Safety Risks Register" },
    { key: "leg", label: "Legislation Register" },
    { key: "eai", label: "Environmental Aspects & Impact Register" },
    { key: "ei",  label: "Equipment & Inventory Register" },
    { key: "tra", label: "Training Register" },
    { key: "doc", label: "Documents Register" },
    { key: "ven", label: "Vendor Register" },
    { key: "cus", label: "Customer Register" },
    { key: "fb",  label: "Feedback Register" },
    { key: "ea",  label: "Employee Performance Appraisal Register" },
    { key: "moc", label: "Management of Changes Register" },
    { key: "fin", label: "Findings Register" },
    { key: "aop", label: "Assurance & Oversight Program" },
    { key: "mrm", label: "Management Review Meeting Register" },
  ];

  const getToken = () =>
    document.cookie.split("; ").find((r) => r.startsWith("superAdmin_token="))?.split("=")[1] ?? "";

  const [lineManagerModal, setLineManagerModal] = useState({ open: false, empId: null });
  const [staffList, setStaffList] = useState([]);
  const [selectedLineManager, setSelectedLineManager] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);
  const [originalAccesses, setOriginalAccesses] = useState([]);

  // ────────────────────────────────────────────────
  // Login check on mount
  // ────────────────────────────────────────────────

  useEffect(() => {
    const token = document.cookie.split("; ").find((r) => r.startsWith("superAdmin_token="))?.split("=")[1];
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchCompanies();
  }, [isLoggedIn]);

  // ────────────────────────────────────────────────
  // Login handler
  // ────────────────────────────────────────────────

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("http://isosofts.com/api/superAdmin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password1: loginForm.password1,
          password2: loginForm.password2,
        }),
      });

      if (!res.ok) {
        setLoginError("Invalid passwords. Please try again.");
        setLoginLoading(false);
        return;
      }

      const data = await res.json();
      const token = data.token;

      // Token'ı cookie'ye kaydet
      document.cookie = `superAdmin_token=${token}; path=/; max-age=86400`;

      setIsLoggedIn(true);
      setLoginForm({ password1: "", password2: "" });
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Connection error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  // Access
  // ────────────────────────────────────────────────

  const saveAccesses = async () => {
    const token = getToken();
    const toAdd = empAccesses.filter((r) => !originalAccesses.includes(r));
    const toRemove = originalAccesses.filter((r) => !empAccesses.includes(r));

    try {
      for (const reg of toAdd) {
        await fetch(
          `http://isosofts.com/api/superAdmin/user/${accessModal.emp.id}/access?register=${reg}&token=${token}`,
          { method: "POST" }
        );
      }
      for (const reg of toRemove) {
        await fetch(
          `http://isosofts.com/api/superAdmin/user/${accessModal.emp.id}/access?register=${reg}&token=${token}`,
          { method: "DELETE" }
        );
      }
    } catch (err) {
      console.error("Access save error:", err);
    }

    setAccessModal({ open: false, emp: null });
  };

  const openAccessModal = async (emp) => {
    setAccessModal({ open: true, emp });
    setAccessLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`http://isosofts.com/api/superAdmin/user/${emp.id}/access?token=${token}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data.map((d) => d.register) : [];
      setEmpAccesses(list);
      setOriginalAccesses(list);
    } catch (err) {
      console.error("Access fetch error:", err);
      setEmpAccesses([]);
      setOriginalAccesses([]);
    } finally {
      setAccessLoading(false);
    }
  };

  const toggleAccess = (registerKey, isCurrentlyActive) => {
    setEmpAccesses((prev) =>
      isCurrentlyActive ? prev.filter((r) => r !== registerKey) : [...prev, registerKey]
    );
  };

  const [companies, setCompanies] = useState([]);

  const fetchCompanies = () => {
    const token = document.cookie.split("; ").find((r) => r.startsWith("superAdmin_token="))?.split("=")[1];
    if (!token) return;

    fetch(`http://isosofts.com/api/superAdmin/company?token=${encodeURIComponent(token)}`)
      .then(res => {
        if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCompanies(
          data.map(comp => ({
            id: comp.id,
            name: comp.name,
            email: comp.domain,
            country: "",
            status: comp.isActive === 1 ? "active" : "inactive",
            registries: [],
            employees: [],
          })) ?? []
        );
      })
      .catch(err => console.error("Companies yüklenemedi:", err));
  };

  useEffect(() => {
    if (!selectedCompanyId || !isLoggedIn) return;

    const token = getToken();
    if (!token) return;

    fetch(`http://isosofts.com/api/superAdmin/company/${selectedCompanyId}/account?token=${encodeURIComponent(token)}`)
      .then(res => {
        if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCompanies(prev =>
          prev.map(c =>
            c.id === selectedCompanyId
              ? {
                  ...c,
                  employees: Array.isArray(data) ? data.map(emp => ({
                    id: emp.id,
                    name: emp.name,
                    surname: emp.surname,
                    fullName: `${emp.name} ${emp.surname}`,
                    email: emp.email,
                    role: emp.isAdmin == 1 ? "admin" : "user",
                    canEdit: emp.isAdmin == 1,
                    status: "active",
                    phoneNumber: emp.phoneNumber,
                    isActive: emp.isActive,
                  })) : []
                }
              : c
          )
        );
      })
      .catch(err => console.error("Staff yüklenemedi:", err));
  }, [selectedCompanyId]);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  const saveCompanyName = async () => {
    const token = getToken();

    try {
      const res = await fetch(`http://isosofts.com/api/superAdmin/company/${selectedCompanyId}?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCompanyForm.name, domain: editCompanyForm.domain }),
      });
      if (!res.ok) throw new Error("Güncelleme başarısız");

      setCompanies(prev =>
        prev.map(c =>
          c.id === selectedCompanyId ? { ...c, name: editCompanyForm.name, email: editCompanyForm.domain } : c
        )
      );

      setShowEditCompanyModal(false);
    } catch (err) {
      console.error("Company update error:", err);
    }
  };

  // Form states
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: "",
    domain: "",
  });

  const [editCompanyForm, setEditCompanyForm] = useState({
    name: "",
    domain: "",
  });

  const [newEmployeeForm, setNewEmployeeForm] = useState({
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    isAdmin: 0,
  });

  const [editEmployeeForm, setEditEmployeeForm] = useState({
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
  });

  const [resetPasswordForm, setResetPasswordForm] = useState({
    employeeId: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [newRegistryForm, setNewRegistryForm] = useState({ name: "" });
  const [editRegistryForm, setEditRegistryForm] = useState({ index: -1, name: "" });

  const openSetLineManager = async (empId) => {
    setLineManagerModal({ open: true, empId });
    setSelectedLineManager("");
    setStaffLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`http://isosofts.com/api/superAdmin/company/${selectedCompanyId}/account?isActive=1&token=${token}`);
      const data = await res.json();
      setStaffList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Staff fetch error:", err);
      setStaffList([]);
    } finally {
      setStaffLoading(false);
    }
  };

  const saveLineManager = async () => {
    try {
      const token = getToken();

      const res = await fetch(
        `http://isosofts.com/api/superAdmin/user/${lineManagerModal.empId}/lineManager?token=${token}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lineManagerId: selectedLineManager }),
        }
      );

      if (!res.ok) throw new Error("Failed to assign line manager");

      setLineManagerModal({ open: false, empId: null });
      setStaffList([]);
    } catch (err) {
      console.error("Save line manager error:", err);
    }
  };

  // ────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    const token = getToken();

    try {
      const res = await fetch(`http://isosofts.com/api/superAdmin/company?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCompanyForm.name,
          domain: newCompanyForm.domain,
        }),
      });

      if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);

      setNewCompanyForm({ name: "", domain: "" });
      setShowNewCompanyModal(false);
      fetchCompanies();
    } catch (err) {
      console.error("Company oluşturulamadı:", err);
    }
  };

  const handleEditCompany = (e) => {
    e.preventDefault();
    setCompanies((prev) =>
      prev.map((c) => (c.id === selectedCompanyId ? { ...c, ...editCompanyForm } : c))
    );
    setShowEditCompanyModal(false);
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      console.warn("Auth token bulunamadı");
      return;
    }

    try {
      const res = await fetch(`http://isosofts.com/api/superAdmin/company/${selectedCompanyId}/account?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newEmployeeForm.name,
          surname: newEmployeeForm.surname,
          email: newEmployeeForm.email,
          phoneNumber: newEmployeeForm.phoneNumber,
          password: newEmployeeForm.password,
          confirmPassword: newEmployeeForm.confirmPassword,
          isAdmin: newEmployeeForm.isAdmin,
        }),
      });

      if (!res.ok) {
        throw new Error(`Sunucu hatası: ${res.status}`);
      }

      const refreshRes = await fetch(`http://isosofts.com/api/superAdmin/company/${selectedCompanyId}/account?token=${encodeURIComponent(token)}`);
      if (!refreshRes.ok) throw new Error(`Sunucu hatası: ${refreshRes.status}`);
      const refreshedData = await refreshRes.json();
      setCompanies(prev =>
        prev.map(c =>
          c.id === selectedCompanyId
            ? {
                ...c,
                employees: refreshedData.map(emp => ({
                  id: emp.id,
                  name: emp.name,
                  surname: emp.surname,
                  fullName: `${emp.name} ${emp.surname}`,
                  email: emp.email,
                  role: emp.isAdmin == 1 ? "admin" : "user",
                  canEdit: emp.isAdmin == 1,
                  status: "active",
                  phoneNumber: emp.phoneNumber,
                  isActive: emp.isActive,
                }))
              }
            : c
        )
      );

      setShowNewEmployeeModal(false);
      setNewEmployeeForm({
        name: "",
        surname: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        isAdmin: 0,
      });

    } catch (err) {
      console.error("Çalışan eklenemedi:", err);
    }
  };

  const handleEditEmployee = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (!token) {
      alert("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    if (!editEmployeeForm.id) {
      alert("Personel ID bilgisi eksik!");
      return;
    }

    const payload = {
      name: editEmployeeForm.name.trim(),
      surname: editEmployeeForm.surname.trim(),
      email: editEmployeeForm.email.trim(),
      phoneNumber: editEmployeeForm.phoneNumber
        ? editEmployeeForm.phoneNumber
        : undefined,
    };

    try {
      const response = await fetch(
        `http://isosofts.com/api/superAdmin/user/${selectedEmployee.id}?token=${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let errorMessage = `Hata: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      setCompanies(prev =>
        prev.map(company =>
          company.id === selectedCompany.id
            ? {
                ...company,
                employees: company.employees.map(emp =>
                  emp.id === selectedEmployee.id
                    ? {
                        ...emp,
                        name: payload.name,
                        surname: payload.surname,
                        fullName: `${payload.name} ${payload.surname}`,
                        email: payload.email,
                        phoneNumber: payload.phoneNumber,
                      }
                    : emp
                ),
              }
            : company
        )
      );

      setSelectedEmployee(null);
      setShowEditEmployeeModal(false);

    } catch (err) {
      console.error("Güncelleme hatası:", err);
      alert(`Güncelleme başarısız: ${err.message || "Bilinmeyen hata"}`);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (resetPasswordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("Token bulunamadı");
      return;
    }

    try {
      const res = await fetch(
        `http://isosofts.com/api/superAdmin/user/${resetPasswordForm.employeeId}/password?token=${encodeURIComponent(token)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: resetPasswordForm.newPassword,
            confirmPassword: resetPasswordForm.confirmPassword,
          }),
        }
      );

      if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);

      setResetPasswordForm({ employeeId: "", newPassword: "", confirmPassword: "" });
      setShowResetPasswordModal(false);
    } catch (err) {
      console.error("Şifre güncellenemedi:", err);
      alert(`Güncelleme başarısız: ${err.message}`);
    }
  };

  const toggleCompanyStatus = async (companyId, currentStatus) => {
    const token = getToken();
    const action = currentStatus === "active" ? "unactive" : "active";

    try {
      const res = await fetch(
        `http://isosofts.com/api/superAdmin/company/${companyId}/${action}?token=${token}`,
        { method: "PUT", headers: { "Content-Type": "application/json" } }
      );

      if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);

      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId
            ? { ...c, status: c.status === "active" ? "inactive" : "active" }
            : c
        )
      );
    } catch (err) {
      console.error("Şirket durumu güncellenemedi:", err);
    }
  };

  const toggleEmployeeStatus = async (employeeId) => {
    const token = getToken();
    if (!token) {
      console.warn("Auth token bulunamadı");
      return;
    }

    const employee = (selectedCompany.employees ?? []).find(emp => emp.id === employeeId);
    const action = employee.isActive ? "unactive" : "active";

    try {
      const res = await fetch(
        `http://isosofts.com/api/superAdmin/user/${employeeId}/${action}?token=${encodeURIComponent(token)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        throw new Error(`Sunucu hatası: ${res.status}`);
      }

      setCompanies((prev) =>
        prev.map((c) =>
          c.id === selectedCompany.id
            ? {
                ...c,
                employees: c.employees.map((emp) =>
                  emp.id === employeeId
                    ? { ...emp, isActive: !emp.isActive }
                    : emp
                ),
              }
            : c
        )
      );
    } catch (err) {
      console.error("Durum güncellenemedi:", err);
    }
  };

  const toggleEmployeeEditRight = (companyId, employeeId) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId
          ? {
              ...c,
              employees: c.employees.map((emp) =>
                emp.id === employeeId ? { ...emp, canEdit: !emp.canEdit } : emp
              ),
            }
          : c
      )
    );
  };

  const handleCopyRegistry = (targetCompanyId) => {
    if (!selectedCompanyId || !targetCompanyId) return;
    const source = companies.find((c) => c.id === selectedCompanyId);
    if (!source) return;

    setCompanies((prev) => {
      const updated = [...prev];
      const targetIndex = updated.findIndex((c) => c.id === targetCompanyId);
      if (targetIndex === -1) return updated;
      updated[targetIndex] = {
        ...updated[targetIndex],
        registries: [...source.registries],
      };
      return updated;
    });

    setShowCopyRegistryModal(false);
  };

  // Registry Handlers
  const handleAddRegistry = (e) => {
    e.preventDefault();
    if (!newRegistryForm.name.trim()) return;

    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selectedCompanyId
          ? { ...c, registries: [...c.registries, newRegistryForm.name.trim()] }
          : c
      )
    );

    setNewRegistryForm({ name: "" });
    setShowAddRegistryModal(false);
  };

  const handleEditRegistry = (e) => {
    e.preventDefault();
    if (!editRegistryForm.name.trim() || editRegistryForm.index < 0) return;

    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selectedCompanyId
          ? {
              ...c,
              registries: c.registries.map((reg, i) =>
                i === editRegistryForm.index ? editRegistryForm.name.trim() : reg
              ),
            }
          : c
      )
    );

    setEditRegistryForm({ index: -1, name: "" });
    setShowEditRegistryModal(false);
  };

  const handleDeleteRegistry = (index) => {
    if (!window.confirm("Are you sure you want to delete this registry?")) return;

    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selectedCompanyId
          ? { ...c, registries: c.registries.filter((_, i) => i !== index) }
          : c
      )
    );
  };

  // Open edit modals
  const openEditCompany = () => {
    if (!selectedCompany) return;
    setEditCompanyForm({
      name: selectedCompany.name,
      domain: selectedCompany.email,
    });
    setShowEditCompanyModal(true);
  };

  const openEditEmployee = (emp) => {
    setSelectedEmployee(emp);
    setEditEmployeeForm({
      id: emp.id,
      name: emp.name || emp.fullName?.split(" ")[0] || "",
      surname: emp.surname || emp.fullName?.split(" ").slice(1).join(" ") || "",
      email: emp.email || "",
      phoneNumber: emp.phoneNumber || "",
      canEdit: emp.canEdit,
    });
    setShowEditEmployeeModal(true);
  };

  const openResetPassword = (empId) => {
    setResetPasswordForm({
      employeeId: empId,
      newPassword: "",
      confirmPassword: "",
    });
    setShowResetPasswordModal(true);
  };

  const openEditRegistry = (index, currentName) => {
    setEditRegistryForm({ index, name: currentName });
    setShowEditRegistryModal(true);
  };

  // ────────────────────────────────────────────────
  // LOGIN SCREEN
  // ────────────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-10 text-white text-center">
            <h1 className="text-3xl font-bold">Super Admin</h1>
            <p className="text-blue-100 mt-2">IsoSofts.com</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password 1</label>
              <input
                type="password"
                value={loginForm.password1}
                onChange={(e) => setLoginForm({ ...loginForm, password1: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password 2</label>
              <input
                type="password"
                value={loginForm.password2}
                onChange={(e) => setLoginForm({ ...loginForm, password2: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              />
            </div>
            {loginError && (
              <p className="text-red-600 text-sm">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Super Admin Panel</h1>
          <p className="text-gray-600 mt-2">
            Company & User Management • Multi-Registry System
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left - Companies List */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-5 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">Company</h2>
                <button
                  onClick={() => setShowNewCompanyModal(true)}
                  className="bg-white text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50"
                >
                  + New Company
                </button>
              </div>
              <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
                {companies.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedCompanyId(comp.id)}
                    className={`p-5 cursor-pointer hover:bg-gray-50 transition ${
                      selectedCompanyId === comp.id
                        ? "bg-blue-50 border-l-4 border-blue-600"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{comp.name}</p>
                        <p className="text-sm text-gray-600">
                          {comp.email}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            comp.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {comp.status}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleCompanyStatus(comp.id, comp.status); }}
                          className={`text-xs font-medium ${
                            comp.status === "active"
                              ? "text-red-600 hover:text-red-800"
                              : "text-green-600 hover:text-green-800"
                          }`}
                        >
                          {comp.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Selected Company Details */}
          <div className="lg:col-span-8 space-y-8">
            {selectedCompany ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-8 py-10 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold">{selectedCompany.name}</h2>
                      <p className="text-blue-100 mt-2">{selectedCompany.country}</p>
                      <p className="text-blue-200 mt-1">{selectedCompany.email}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <h2 className="text-xl font-bold"> Powered By IsoSofts.com</h2>
                    </div>
                  </div>
                </div>

                  {/* Action Buttons */}
                  <div className="p-6 border-b border-gray-200 flex flex-wrap gap-4">
                    <button
                      onClick={() => setShowNewEmployeeModal(true)}
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
                    >
                      + Add Employee
                    </button>
                    <button
                      onClick={() => openEditCompany()}
                      className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 border border-gray-300"
                    >
                      Edit Company
                    </button>
                  </div>


                {/* Employees Table */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-5">Employees</h3>
                  {!selectedCompany.employees || selectedCompany.employees.length === 0 ? (
                    <p className="text-gray-500 italic">No employees yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Full Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Access
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(selectedCompany.employees ?? []).map((emp) => (
                            <tr key={emp.id}>
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                {emp.fullName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                {emp.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => openAccessModal(emp)}
                                  className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                                >
                                  Edit Accesses
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                    emp.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {emp.isActive ? "active" : "inactive"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <button
                                  onClick={() => openSetLineManager(emp.id)}
                                  className="text-orange-600 hover:text-orange-800"
                                >
                                  Set Line Manager
                                </button>
                                <button
                                  onClick={() => openEditEmployee(emp)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => openResetPassword(emp.id)}
                                  className="text-purple-600 hover:text-purple-800"
                                >
                                  Reset Password
                                </button>
                                <button
                                  onClick={() => toggleEmployeeStatus(emp.id)}
                                  className={`${
                                    emp.isActive
                                      ? "text-red-600 hover:text-red-800"
                                      : "text-green-600 hover:text-green-800"
                                  }`}
                                >
                                  {emp.isActive ? "Deactivate" : "Activate"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Registries */}
                <div className="p-6 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Registries</h3>

                  {selectedCompany.registries.length === 0 ? (
                    <p className="text-gray-500 italic">No registries yet</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedCompany.registries.map((reg, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 group"
                        >
                          <div className="font-medium text-gray-900">{reg}</div>
                          <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* <button
                              onClick={() => openEditRegistry(index, reg)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRegistry(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
                Select a company from the left panel
              </div>
            )}
          </div>
        </div>

        {/* ────────────────────────────────────────────────
             MODALS
        ──────────────────────────────────────────────── */}

        {/* New Company Modal */}
        {showNewCompanyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8">
              <h3 className="text-2xl font-bold mb-6">Create New Company</h3>
              <form onSubmit={handleCreateCompany} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={newCompanyForm.name}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={newCompanyForm.domain}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, domain: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="e.g. company.com"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowNewCompanyModal(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Company
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Company Modal */}
        {showEditCompanyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowEditCompanyModal(false)} />
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-lg p-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V7l7-7h9a2 2 0 012 2v17z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-lg leading-tight">Edit Company</h2>
                    <p className="text-gray-300 text-xs mt-0.5">Update company information</p>
                  </div>
                </div>
                <button onClick={() => setShowEditCompanyModal(false)} className="text-white/70 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-6 py-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={editCompanyForm.name}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, name: e.target.value })}
                    placeholder="Enter company name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={editCompanyForm.domain}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, domain: e.target.value })}
                    placeholder="e.g. company.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-400 transition-colors"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowEditCompanyModal(false)}
                  className="px-5 py-2 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCompanyName}
                  disabled={!editCompanyForm.name.trim()}
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-black disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Line Manager */}
        {lineManagerModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-blue-900/60 backdrop-blur-sm"
              onClick={() => { setLineManagerModal({ open: false, empId: null }); setStaffList([]); }}
            />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-lg p-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-lg leading-tight">Set Line Manager</h2>
                    <p className="text-blue-100 text-xs mt-0.5">Assign a manager to this employee</p>
                  </div>
                </div>
                {/* Close button */}
                <button
                  onClick={() => { setLineManagerModal({ open: false, empId: null }); setStaffList([]); }}
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Select Manager
                </label>

                {staffLoading ? (
                  <div className="flex items-center gap-3 py-4 text-gray-400">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span className="text-sm">Loading staff...</span>
                  </div>
                ) : staffList.length === 0 ? (
                  <div className="flex items-center gap-2 py-4 text-red-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">No staff found</span>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedLineManager}
                      onChange={(e) => setSelectedLineManager(e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-colors cursor-pointer"
                    >
                      <option value="">-- Select Line Manager --</option>
                      {staffList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} {s.surname}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Info box - seçilince görünür */}
                {selectedLineManager && (
                  <div className="mt-3 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {staffList.find(s => s.id === selectedLineManager)?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-xs text-blue-700 font-medium">
                      {staffList.find(s => s.id === selectedLineManager)?.name}{" "}
                      {staffList.find(s => s.id === selectedLineManager)?.surname} will be assigned as line manager
                    </span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => { setLineManagerModal({ open: false, empId: null }); setStaffList([]); }}
                  className="px-5 py-2 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveLineManager}
                  disabled={!selectedLineManager}
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  Assign Manager
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Access Modal */}

        {accessModal.open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      onClick={() => setAccessModal({ open: false, emp: null })}
    />
    <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-lg p-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg leading-tight">Edit Accesses</h2>
            <p className="text-blue-100 text-xs mt-0.5">
              {accessModal.emp?.fullName}
            </p>
          </div>
        </div>
        <button
          onClick={() => setAccessModal({ open: false, emp: null })}
          className="text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
        {accessLoading ? (
          <div className="flex items-center gap-3 py-6 text-gray-400 justify-center">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm">Loading accesses...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {REGISTERS.map((reg) => {
              const isActive = empAccesses.includes(reg.key);
              return (
                <div
                  key={reg.key}
                  onClick={() => toggleAccess(reg.key, isActive)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                    isActive
                      ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                      isActive ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"
                    }`}>
                      {isActive && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${isActive ? "text-blue-800 font-medium" : "text-gray-600"}`}>
                      {reg.label}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-500"
                  }`}>
                    {reg.key}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          {empAccesses.length} of {REGISTERS.length} accesses granted
        </span>
        <button
           onClick={saveAccesses}
          className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
        >
          Done
        </button>
      </div>
    </div>
  </div>
)}

        {/* New Employee Modal */}
        {showNewEmployeeModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50"
  style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(15, 23, 42, 0.6)" }}>
  <div className="relative bg-white w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl"
    style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>
    
    {/* Üst renkli şerit */}
    <div style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", padding: "28px 32px 24px" }}>
      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
        {selectedCompany?.name}
      </p>
      <h3 style={{ color: "white", fontSize: "22px", fontWeight: 700, margin: 0 }}>
        Add New Employee
      </h3>
    </div>

    {/* Form alanı */}
    <form onSubmit={handleCreateEmployee} style={{ padding: "28px 32px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        
        {/* Name */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Name</label>
          <input type="text" value={newEmployeeForm.name}
            onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, name: e.target.value })}
            required
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Surname */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Surname</label>
          <input type="text" value={newEmployeeForm.surname}
            onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, surname: e.target.value })}
            required
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Email - full width */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Email</label>
          <input type="email" value={newEmployeeForm.email}
            onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, email: e.target.value })}
            required
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Phone - full width */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Phone Number</label>
          <input type="text" value={newEmployeeForm.phoneNumber}
            onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, phoneNumber: e.target.value })}
            required
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Password */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Password</label>
          <input type="password" value={newEmployeeForm.password}
            onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, password: e.target.value })}
            placeholder="Min. 6 chars"
            required
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Confirm</label>
          <input type="password" value={newEmployeeForm.confirmPassword}
            onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, confirmPassword: e.target.value })}
            required
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* isAdmin - full width */}
        <div style={{ gridColumn: "span 2", display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
          <input
            type="checkbox"
            id="isAdminCheck"
            checked={newEmployeeForm.isAdmin === 1}
            onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, isAdmin: e.target.checked ? 1 : 0 })}
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          <label htmlFor="isAdminCheck" style={{ fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
            Grant Admin Rights
          </label>
        </div>

      </div>

      {/* Butonlar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "28px" }}>
        <button type="button" onClick={() => setShowNewEmployeeModal(false)}
          style={{ padding: "10px 22px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "white", fontSize: "14px", fontWeight: 500, color: "#374151", cursor: "pointer" }}>
          Cancel
        </button>
        <button type="submit"
          style={{ padding: "10px 22px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #3b82f6)", fontSize: "14px", fontWeight: 600, color: "white", cursor: "pointer", boxShadow: "0 4px 15px rgba(99,102,241,0.4)" }}>
          Add Employee
        </button>
      </div>
    </form>
  </div>
          </div>
        )}

        {/* Edit Employee Modal */}
        {showEditEmployeeModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50"
  style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(15, 23, 42, 0.6)" }}>
  <div className="relative bg-white w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl"
    style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>

    {/* Üst gradient şerit */}
    <div style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)", padding: "28px 32px 24px" }}>
      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
        Employee
      </p>
      <h3 style={{ color: "white", fontSize: "22px", fontWeight: 700, margin: 0 }}>
        Edit Employee
      </h3>
    </div>

    {/* Form */}
    <form onSubmit={handleEditEmployee} style={{ padding: "28px 32px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Name */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Name</label>
          <input type="text" value={editEmployeeForm.name}
            onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, name: e.target.value })}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#8b5cf6"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Surname */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Surname</label>
          <input type="text" value={editEmployeeForm.surname}
            onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, surname: e.target.value })}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#8b5cf6"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Email - full width */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Email</label>
          <input type="email" value={editEmployeeForm.email}
            onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, email: e.target.value })}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#8b5cf6"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Phone - full width */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Phone Number</label>
          <input type="number" value={editEmployeeForm.phoneNumber}
            onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, phoneNumber: e.target.value })}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#8b5cf6"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>
      </div>

      {/* Butonlar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "28px" }}>
        <button type="button" onClick={() => setShowEditEmployeeModal(false)}
          style={{ padding: "10px 22px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "white", fontSize: "14px", fontWeight: 500, color: "#374151", cursor: "pointer" }}>
          Cancel
        </button>
        <button type="submit"
          style={{ padding: "10px 22px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #8b5cf6, #6366f1)", fontSize: "14px", fontWeight: 600, color: "white", cursor: "pointer", boxShadow: "0 4px 15px rgba(139,92,246,0.4)" }}>
          Save Changes
        </button>
      </div>
    </form>
  </div>
</div>
        )}

        {/* Reset Password Modal */}
        {showResetPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50"
  style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(15, 23, 42, 0.6)" }}>
  <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl"
    style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>

    <div style={{ background: "linear-gradient(135deg, #ec4899, #f43f5e)", padding: "28px 32px 24px" }}>
      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
        Security
      </p>
      <h3 style={{ color: "white", fontSize: "22px", fontWeight: 700, margin: 0 }}>
        Reset / Change Password
      </h3>
    </div>

    {/* Form */}
    <form onSubmit={handleResetPassword} style={{ padding: "28px 32px 32px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* New Password */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>New Password</label>
          <input type="text" value={resetPasswordForm.newPassword}
            onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, newPassword: e.target.value })}
            placeholder="Min. 6 characters"
            required
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#ec4899"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Confirm Password</label>
          <input type="text" value={resetPasswordForm.confirmPassword}
            onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, confirmPassword: e.target.value })}
            required
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#ec4899"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>
      </div>

      {/* Butonlar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "28px" }}>
        <button type="button" onClick={() => setShowResetPasswordModal(false)}
          style={{ padding: "10px 22px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "white", fontSize: "14px", fontWeight: 500, color: "#374151", cursor: "pointer" }}>
          Cancel
        </button>
        <button type="submit"
          style={{ padding: "10px 22px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #ec4899, #f43f5e)", fontSize: "14px", fontWeight: 600, color: "white", cursor: "pointer", boxShadow: "0 4px 15px rgba(236,72,153,0.4)" }}>
          Update Password
        </button>
      </div>
    </form>
  </div>
</div>
        )}

        {/* Add Registry Modal */}
        {showAddRegistryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8">
              <h3 className="text-2xl font-bold mb-6">Add New Registry</h3>
              <form onSubmit={handleAddRegistry} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registry Name
                  </label>
                  <input
                    type="text"
                    value={newRegistryForm.name}
                    onChange={(e) => setNewRegistryForm({ name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="e.g. ISO 9001:2015 - Azerbaijan"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowAddRegistryModal(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add Registry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Registry Modal */}
        {showEditRegistryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8">
              <h3 className="text-2xl font-bold mb-6">Edit Registry</h3>
              <form onSubmit={handleEditRegistry} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registry Name
                  </label>
                  <input
                    type="text"
                    value={editRegistryForm.name}
                    onChange={(e) =>
                      setEditRegistryForm({ ...editRegistryForm, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowEditRegistryModal(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Copy Registry Modal */}
        {showCopyRegistryModal && selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 p-8">
              <h3 className="text-2xl font-bold mb-6">
                Copy Registries from {selectedCompany.name}
              </h3>
              <p className="text-gray-600 mb-6">Choose target company:</p>

              <div className="space-y-3 max-h-80 overflow-y-auto mb-8">
                {companies
                  .filter((c) => c.id !== selectedCompanyId)
                  .map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => handleCopyRegistry(comp.id)}
                      className="w-full text-left p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                    >
                      <div className="font-medium">{comp.name}</div>
                      <div className="text-sm text-gray-600">
                        {comp.country} • {comp.registries.length} registries
                      </div>
                    </button>
                  ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowCopyRegistryModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;