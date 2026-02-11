import React, { useState } from "react";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([
    {
      id: "comp-1",
      name: "ABC MMC",
      country: "Azerbaijan",
      email: "info@abc.az",
      status: "active",
      employees: [
        {
          id: "emp-11",
          fullName: "Elchin Mammadov",
          email: "elchin@abc.az",
          role: "admin",
          canEdit: true,
          status: "active",
          password: "admin2025",
        },
        {
          id: "emp-12",
          fullName: "Aygun Huseynova",
          email: "aygun@abc.az",
          role: "user",
          canEdit: false,
          status: "active",
          password: "user123456",
        },
      ],
      registries: [
        "Azerbaijan ISO 9001:2015",
        "Georgia ISO 14001:2015",
        "Turkey ISO 45001:2018",
      ],
    },
    {
      id: "comp-2",
      name: "XYZ Ltd",
      country: "Turkey",
      email: "contact@xyz.com.tr",
      status: "active",
      employees: [],
      registries: ["Turkey ISO 27001:2022"],
    },
  ]);

  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  // Modal states
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showCopyRegistryModal, setShowCopyRegistryModal] = useState(false);
  const [showAddRegistryModal, setShowAddRegistryModal] = useState(false);
  const [showEditRegistryModal, setShowEditRegistryModal] = useState(false);

  // Form states
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: "",
    email: "",
    country: "",
  });

  const [editCompanyForm, setEditCompanyForm] = useState({
    name: "",
    email: "",
    country: "",
  });

  const [newEmployeeForm, setNewEmployeeForm] = useState({
    fullName: "",
    email: "",
    canEdit: false,
    initialPassword: "",
  });

  const [editEmployeeForm, setEditEmployeeForm] = useState({
    id: "",
    fullName: "",
    email: "",
    canEdit: false,
  });

  const [resetPasswordForm, setResetPasswordForm] = useState({
    employeeId: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [newRegistryForm, setNewRegistryForm] = useState({ name: "" });
  const [editRegistryForm, setEditRegistryForm] = useState({ index: -1, name: "" });

  // ────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────

  const handleCreateCompany = (e) => {
    e.preventDefault();
    const newComp = {
      id: `comp-${Date.now()}`,
      name: newCompanyForm.name,
      email: newCompanyForm.email,
      country: newCompanyForm.country,
      status: "active",
      employees: [],
      registries: [],
    };
    setCompanies([...companies, newComp]);
    setNewCompanyForm({ name: "", email: "", country: "" });
    setShowNewCompanyModal(false);
  };

  const handleEditCompany = (e) => {
    e.preventDefault();
    setCompanies((prev) =>
      prev.map((c) => (c.id === selectedCompanyId ? { ...c, ...editCompanyForm } : c))
    );
    setShowEditCompanyModal(false);
  };

  const handleCreateEmployee = (e) => {
    e.preventDefault();
    if (!selectedCompanyId) return;
    if (newEmployeeForm.initialPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const newEmp = {
      id: `emp-${Date.now()}`,
      fullName: newEmployeeForm.fullName,
      email: newEmployeeForm.email,
      role: "user",
      canEdit: newEmployeeForm.canEdit,
      status: "active",
      password: newEmployeeForm.initialPassword,
    };

    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selectedCompanyId
          ? { ...c, employees: [...c.employees, newEmp] }
          : c
      )
    );

    setNewEmployeeForm({ fullName: "", email: "", canEdit: false, initialPassword: "" });
    setShowNewEmployeeModal(false);
  };

  const handleEditEmployee = (e) => {
    e.preventDefault();
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selectedCompanyId
          ? {
              ...c,
              employees: c.employees.map((emp) =>
                emp.id === editEmployeeForm.id
                  ? {
                      ...emp,
                      fullName: editEmployeeForm.fullName,
                      email: editEmployeeForm.email,
                      canEdit: editEmployeeForm.canEdit,
                    }
                  : emp
              ),
            }
          : c
      )
    );
    setShowEditEmployeeModal(false);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (resetPasswordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selectedCompanyId
          ? {
              ...c,
              employees: c.employees.map((emp) =>
                emp.id === resetPasswordForm.employeeId
                  ? { ...emp, password: resetPasswordForm.newPassword }
                  : emp
              ),
            }
          : c
      )
    );

    alert("Password has been updated successfully.");
    setResetPasswordForm({ employeeId: "", newPassword: "", confirmPassword: "" });
    setShowResetPasswordModal(false);
  };

  const toggleCompanyStatus = (companyId) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    );
  };

  const toggleEmployeeStatus = (companyId, employeeId) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId
          ? {
              ...c,
              employees: c.employees.map((emp) =>
                emp.id === employeeId
                  ? { ...emp, status: emp.status === "active" ? "inactive" : "active" }
                  : emp
              ),
            }
          : c
      )
    );
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
      email: selectedCompany.email,
      country: selectedCompany.country,
    });
    setShowEditCompanyModal(true);
  };

  const openEditEmployee = (emp) => {
    setEditEmployeeForm({
      id: emp.id,
      fullName: emp.fullName,
      email: emp.email,
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
  // RENDER
  // ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-2">
            Company & User Management • Multi-Registry System
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left - Companies List */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-5 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">Companies</h2>
                <button
                  onClick={() => setShowNewCompanyModal(true)}
                  className="bg-white text-blue-700 px-4 py-1.5 rounded-lg font-medium hover:bg-gray-100"
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
                          {comp.country} • {comp.email}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          comp.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {comp.status}
                      </span>
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
                      <button
                        onClick={openEditCompany}
                        className="bg-white text-blue-800 px-5 py-2 rounded-lg hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleCompanyStatus(selectedCompany.id)}
                        className={`px-5 py-2 rounded-lg font-medium text-white ${
                          selectedCompany.status === "active"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {selectedCompany.status === "active" ? "Deactivate" : "Activate"}
                      </button>
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
                    onClick={() => setShowAddRegistryModal(true)}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700"
                  >
                    + Add Registry
                  </button>
                  <button
                    onClick={() => setShowCopyRegistryModal(true)}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700"
                  >
                    Copy Registries
                  </button>
                </div>

                {/* Employees Table */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-5">Employees</h3>
                  {selectedCompany.employees.length === 0 ? (
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
                          {selectedCompany.employees.map((emp) => (
                            <tr key={emp.id}>
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                {emp.fullName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                {emp.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => toggleEmployeeEditRight(selectedCompany.id, emp.id)}
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    emp.canEdit
                                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                  }`}
                                >
                                  {emp.canEdit ? "Edit" : "Read"}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                    emp.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {emp.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
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
                                  onClick={() => toggleEmployeeStatus(selectedCompany.id, emp.id)}
                                  className={`${
                                    emp.status === "active"
                                      ? "text-red-600 hover:text-red-800"
                                      : "text-green-600 hover:text-green-800"
                                  }`}
                                >
                                  {emp.status === "active" ? "Deactivate" : "Activate"}
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
                            <button
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
                            </button>
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
                    Email
                  </label>
                  <input
                    type="email"
                    value={newCompanyForm.email}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={newCompanyForm.country}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8">
              <h3 className="text-2xl font-bold mb-6">Edit Company</h3>
              <form onSubmit={handleEditCompany} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={editCompanyForm.name}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editCompanyForm.email}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={editCompanyForm.country}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowEditCompanyModal(false)}
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

        {/* New Employee Modal */}
        {showNewEmployeeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8">
              <h3 className="text-2xl font-bold mb-6">
                Add Employee to {selectedCompany?.name}
              </h3>
              <form onSubmit={handleCreateEmployee} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newEmployeeForm.fullName}
                    onChange={(e) =>
                      setNewEmployeeForm({ ...newEmployeeForm, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newEmployeeForm.email}
                    onChange={(e) =>
                      setNewEmployeeForm({ ...newEmployeeForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Password
                  </label>
                  <input
                    type="text"
                    value={newEmployeeForm.initialPassword}
                    onChange={(e) =>
                      setNewEmployeeForm({
                        ...newEmployeeForm,
                        initialPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="Minimum 6 characters"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="canEditNew"
                    checked={newEmployeeForm.canEdit}
                    onChange={(e) =>
                      setNewEmployeeForm({ ...newEmployeeForm, canEdit: e.target.checked })
                    }
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <label htmlFor="canEditNew" className="ml-2 text-gray-700 font-medium">
                    Can edit records
                  </label>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowNewEmployeeModal(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Employee Modal */}
        {showEditEmployeeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8">
              <h3 className="text-2xl font-bold mb-6">Edit Employee</h3>
              <form onSubmit={handleEditEmployee} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editEmployeeForm.fullName}
                    onChange={(e) =>
                      setEditEmployeeForm({ ...editEmployeeForm, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmployeeForm.email}
                    onChange={(e) =>
                      setEditEmployeeForm({ ...editEmployeeForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="canEditEdit"
                    checked={editEmployeeForm.canEdit}
                    onChange={(e) =>
                      setEditEmployeeForm({ ...editEmployeeForm, canEdit: e.target.checked })
                    }
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <label htmlFor="canEditEdit" className="ml-2 text-gray-700 font-medium">
                    Can edit records
                  </label>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowEditEmployeeModal(false)}
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

        {/* Reset Password Modal */}
        {showResetPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8">
              <h3 className="text-2xl font-bold mb-6">Reset / Change Password</h3>
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="text"
                    value={resetPasswordForm.newPassword}
                    onChange={(e) =>
                      setResetPasswordForm({
                        ...resetPasswordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="Minimum 6 characters"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="text"
                    value={resetPasswordForm.confirmPassword}
                    onChange={(e) =>
                      setResetPasswordForm({
                        ...resetPasswordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowResetPasswordModal(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
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

export default AdminDashboard;