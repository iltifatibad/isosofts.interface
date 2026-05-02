import React, { useState, useEffect } from "react";
import { auth, db } from "../utils/firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { ALL_HELP_MODULES } from "../utils/helpContents.js";

const toKey = (title) =>
  title.replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");

const HelpEditor = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [selectedModule, setSelectedModule] = useState(null);
  const [editData, setEditData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [openSections, setOpenSections] = useState({});
  const [firebaseStatus, setFirebaseStatus] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;
    Promise.all(
      ALL_HELP_MODULES.map(async (m) => {
        const key = toKey(m.title);
        const snap = await get(ref(db, `helpContent/${key}`));
        return [key, snap.exists()];
      })
    ).then((results) => {
      const status = {};
      results.forEach(([key, exists]) => (status[key] = exists));
      setFirebaseStatus(status);
    });
  }, [firebaseUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
    } catch {
      setLoginError("Invalid email or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  const loadModule = async (module) => {
    setSelectedModule(module);
    setOpenSections({});
    setSavedMsg("");
    setDataLoading(true);
    const key = toKey(module.title);
    try {
      const snap = await get(ref(db, `helpContent/${key}`));
      setEditData(snap.exists() ? snap.val() : JSON.parse(JSON.stringify(module)));
    } catch {
      setEditData(JSON.parse(JSON.stringify(module)));
    } finally {
      setDataLoading(false);
    }
  };

  const saveModule = async () => {
    if (!editData || !selectedModule) return;
    setSaving(true);
    const key = toKey(selectedModule.title);
    try {
      await set(ref(db, `helpContent/${key}`), editData);
      setFirebaseStatus((p) => ({ ...p, [key]: true }));
      setSavedMsg("Saved successfully!");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch {
      setSavedMsg("Save failed. Check Firebase rules.");
      setTimeout(() => setSavedMsg(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  const resetModule = async () => {
    if (!selectedModule) return;
    setEditData(JSON.parse(JSON.stringify(selectedModule)));
    setSavedMsg("Reset to default (not saved yet)");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  // ── Edit helpers ──────────────────────────────────────────
  const upd = (key, val) => setEditData((p) => ({ ...p, [key]: val }));
  const updStep = (i, val) =>
    setEditData((p) => ({ ...p, howToAdd: p.howToAdd.map((s, x) => (x === i ? val : s)) }));
  const addStep = () =>
    setEditData((p) => ({ ...p, howToAdd: [...(p.howToAdd || []), ""] }));
  const removeStep = (i) =>
    setEditData((p) => ({ ...p, howToAdd: p.howToAdd.filter((_, x) => x !== i) }));
  const updSection = (si, k, val) =>
    setEditData((p) => ({
      ...p,
      sections: p.sections.map((s, x) => (x === si ? { ...s, [k]: val } : s)),
    }));
  const updField = (si, fi, k, val) =>
    setEditData((p) => ({
      ...p,
      sections: p.sections.map((s, sx) =>
        sx !== si
          ? s
          : { ...s, fields: s.fields.map((f, fx) => (fx !== fi ? f : { ...f, [k]: val })) }
      ),
    }));
  const toggleSection = (si) =>
    setOpenSections((p) => ({ ...p, [si]: !p[si] }));

  // ── Auth loading ──────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Firebase Login Screen ─────────────────────────────────
  if (!firebaseUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-pen-to-square text-2xl" />
            </div>
            <h1 className="text-2xl font-bold">Help Editor</h1>
            <p className="text-indigo-100 mt-1 text-sm">Sign in to edit help content</p>
          </div>
          <form onSubmit={handleLogin} className="px-8 py-8 space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 mt-2"
            >
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main Editor ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fas fa-pen-to-square text-white text-base" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Help Content Editor</h1>
            <p className="text-indigo-100 text-xs">Super Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-indigo-100">{firebaseUser.email}</span>
          <button
            onClick={() => signOut(auth)}
            className="text-xs text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6 h-[calc(100vh-72px)]">
        {/* Left — Module List */}
        <div className="w-72 flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Modules</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {ALL_HELP_MODULES.map((module) => {
              const key = toKey(module.title);
              const isSelected = selectedModule?.title === module.title;
              const hasCustom = firebaseStatus[key];
              return (
                <button
                  key={module.title}
                  onClick={() => loadModule(module)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between gap-2 transition-colors
                    ${isSelected ? "bg-indigo-50 border-l-4 border-indigo-500" : "hover:bg-gray-50 border-l-4 border-transparent"}`}
                >
                  <span className={`text-sm font-medium leading-snug ${isSelected ? "text-indigo-700" : "text-gray-700"}`}>
                    {module.title}
                  </span>
                  {hasCustom && (
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-400" title="Customized" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right — Editor */}
        <div className="flex-1 min-w-0 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
          {!selectedModule ? (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-arrow-left text-indigo-300 text-xl" />
                </div>
                <p className="text-gray-500 font-medium">Select a module to edit its help content</p>
                <p className="text-gray-400 text-sm mt-1">
                  {Object.values(firebaseStatus).filter(Boolean).length} of {ALL_HELP_MODULES.length} modules customized
                </p>
              </div>
            </div>
          ) : dataLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Editor Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
                <div>
                  <h2 className="font-bold text-gray-800">{selectedModule.title}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {firebaseStatus[toKey(selectedModule.title)]
                      ? "Using customized content"
                      : "Using default content"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {savedMsg && (
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${savedMsg.includes("failed") ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>
                      {savedMsg}
                    </span>
                  )}
                  <button
                    onClick={resetModule}
                    className="text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset to Default
                  </button>
                  <button
                    onClick={saveModule}
                    disabled={saving}
                    className="text-xs font-semibold text-white bg-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save to Firebase"}
                  </button>
                </div>
              </div>

              {/* Editor Body */}
              {editData && (
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="col-span-2 block">
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Module Title</span>
                      <input
                        value={editData.title}
                        onChange={(e) => upd("title", e.target.value)}
                        className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Subtitle</span>
                      <input
                        value={editData.subtitle || ""}
                        onChange={(e) => upd("subtitle", e.target.value)}
                        className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Description</span>
                      <textarea
                        value={editData.description || ""}
                        onChange={(e) => upd("description", e.target.value)}
                        rows={3}
                        className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                      />
                    </label>
                  </div>

                  {/* How to Add Steps */}
                  {editData.howToAdd && (
                    <div>
                      <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <i className="fas fa-list-ol text-indigo-400" />
                        How to Add Steps
                      </h3>
                      <div className="space-y-2">
                        {editData.howToAdd.map((step, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[11px] flex items-center justify-center font-bold">
                              {i + 1}
                            </span>
                            <input
                              value={step}
                              onChange={(e) => updStep(i, e.target.value)}
                              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <button
                              onClick={() => removeStep(i)}
                              className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                            >
                              <i className="fas fa-times text-xs" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={addStep}
                          className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-semibold mt-1"
                        >
                          <i className="fas fa-plus text-[10px]" /> Add Step
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sections */}
                  {editData.sections?.map((section, si) => (
                    <div key={si} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection(si)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                          <i className={`fas ${section.icon || "fa-table-columns"} text-indigo-400`} />
                          {section.title}
                          <span className="text-gray-400 font-normal normal-case tracking-normal">
                            ({section.fields.length} fields)
                          </span>
                        </span>
                        <i className={`fas fa-chevron-${openSections[si] ? "up" : "down"} text-gray-400 text-xs`} />
                      </button>

                      {openSections[si] && (
                        <div className="px-4 py-4 space-y-3 bg-white">
                          <div className="flex gap-3">
                            <label className="flex-1">
                              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Section Title</span>
                              <input
                                value={section.title}
                                onChange={(e) => updSection(si, "title", e.target.value)}
                                className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              />
                            </label>
                            <label className="w-40">
                              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">FA Icon</span>
                              <input
                                value={section.icon || ""}
                                onChange={(e) => updSection(si, "icon", e.target.value)}
                                placeholder="fa-table-columns"
                                className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              />
                            </label>
                          </div>

                          <div className="space-y-2">
                            {section.fields.map((field, fi) => (
                              <div key={fi} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                                <div className="flex items-center gap-2 mb-2">
                                  <input
                                    value={field.name}
                                    onChange={(e) => updField(si, fi, "name", e.target.value)}
                                    placeholder="Field name"
                                    className="flex-1 text-xs font-semibold border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                                  />
                                  <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer flex-shrink-0">
                                    <input
                                      type="checkbox"
                                      checked={!!field.required}
                                      onChange={(e) => updField(si, fi, "required", e.target.checked)}
                                      className="accent-red-400"
                                    />
                                    Required
                                  </label>
                                  <input
                                    value={field.type}
                                    onChange={(e) => updField(si, fi, "type", e.target.value)}
                                    className="w-32 text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                                    placeholder="Type"
                                  />
                                </div>
                                <textarea
                                  value={field.description}
                                  onChange={(e) => updField(si, fi, "description", e.target.value)}
                                  rows={2}
                                  placeholder="Description"
                                  className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 mb-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-300"
                                />
                                <input
                                  value={field.example || ""}
                                  onChange={(e) => updField(si, fi, "example", e.target.value)}
                                  placeholder="Example value"
                                  className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Save Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-shrink-0">
                <button
                  onClick={resetModule}
                  className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Reset to Default
                </button>
                <button
                  onClick={saveModule}
                  disabled={saving}
                  className="text-sm font-semibold text-white bg-indigo-600 px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save to Firebase"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpEditor;
