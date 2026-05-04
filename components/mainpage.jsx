import { useState } from "react";
import { isAuth } from "../utils/isAuth";

const MODULES = [
  { icon: "fa-briefcase",         label: "Business Risks",     color: "#3b82f6" },
  { icon: "fa-shield-halved",     label: "H&S Risks",          color: "#10b981" },
  { icon: "fa-scale-balanced",    label: "Legislations",       color: "#8b5cf6" },
  { icon: "fa-leaf",              label: "Environmental",      color: "#22c55e" },
  { icon: "fa-gear",              label: "Equipment",          color: "#f59e0b" },
  { icon: "fa-graduation-cap",    label: "Trainings",          color: "#06b6d4" },
  { icon: "fa-file-lines",        label: "Documents",          color: "#6366f1" },
  { icon: "fa-handshake",         label: "Vendors",            color: "#ec4899" },
  { icon: "fa-users",             label: "Customers",          color: "#14b8a6" },
  { icon: "fa-comment-dots",      label: "Feedbacks",          color: "#f97316" },
  { icon: "fa-chart-line",        label: "KPI",                color: "#3b82f6" },
  { icon: "fa-chart-bar",         label: "OPI",                color: "#8b5cf6" },
];

const ISO_STANDARDS = [
  {
    code: "ISO 9001",
    title: "Quality Management",
    desc: "Establish robust quality processes that consistently meet customer expectations and drive continuous improvement across your organization.",
    icon: "fa-star",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    modules: ["Business Risks", "Documents", "Customer", "KPI / OPI"],
  },
  {
    code: "ISO 14001",
    title: "Environmental Management",
    desc: "Manage your environmental impact, reduce waste, and demonstrate your commitment to sustainability with structured compliance tools.",
    icon: "fa-leaf",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    modules: ["Environmental Aspects", "Findings", "Action Log", "Management Review"],
  },
  {
    code: "ISO 45001",
    title: "Occupational Health & Safety",
    desc: "Protect your workforce with systematic hazard identification, risk assessment, and proactive safety management processes.",
    icon: "fa-shield-halved",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    modules: ["H&S Risks", "Trainings", "Assurance & Oversight", "MOC"],
  },
];

const STATS = [
  { value: "18+", label: "Management Modules",  icon: "fa-layer-group",  color: "#3b82f6" },
  { value: "3",   label: "ISO Standards",       icon: "fa-certificate",  color: "#8b5cf6" },
  { value: "360°",label: "QHSE Coverage",       icon: "fa-circle-check", color: "#10b981" },
  { value: "∞",   label: "Real-time Analytics", icon: "fa-chart-line",   color: "#f59e0b" },
];

const SERVICES = [
  { name: "Algebra",    desc: "Integrated QHSE management — risks, compliance, KPIs and more in one platform.", icon: "fa-calculator",  action: () => isAuth(),   label: "Go to Algebra" },
  { name: "Physics",    desc: "Advanced engineering calculations and technical analysis tools.",                  icon: "fa-atom",         action: () => {},         label: "Coming Soon" },
  { name: "Geometry",   desc: "Spatial data management and geometric analysis platform.",                        icon: "fa-shapes",       action: () => {},         label: "Coming Soon" },
  { name: "Philosophy", desc: "Knowledge management and decision-support framework.",                            icon: "fa-lightbulb",    action: () => {},         label: "Coming Soon" },
];

const IsosoftsMain = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── HERO ── */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c2350 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(59,130,246,0.07) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        <div style={{ position: "absolute", top: "10%", left: "5%",  width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <div className="space-y-8">
              <div className="flex gap-2 flex-wrap">
                {["ISO 9001", "ISO 14001", "ISO 45001"].map(b => (
                  <span key={b} style={{
                    padding: "4px 14px", borderRadius: 999,
                    border: "1px solid rgba(59,130,246,0.45)",
                    color: "#93c5fd", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
                    background: "rgba(59,130,246,0.1)",
                  }}>{b}</span>
                ))}
              </div>

              <div>
                <h1 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 800, lineHeight: 1.1, margin: 0 }}>
                  <span style={{
                    background: "linear-gradient(90deg, #ffffff 30%, #93c5fd 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>
                    Smarter QHSE
                  </span>
                  <br />
                  <span style={{ color: "#ffffff" }}>Management.</span>
                </h1>
                <p style={{ marginTop: 20, fontSize: 18, color: "rgba(148,163,184,0.9)", lineHeight: 1.7, maxWidth: 480 }}>
                  One platform for all your ISO compliance needs — risks, documents, KPIs, audits and more. Built for organizations that take quality seriously.
                </p>
              </div>

              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => isAuth()}
                  style={{
                    padding: "14px 32px", borderRadius: 12, border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    color: "#fff", fontSize: 15, fontWeight: 700,
                    boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(59,130,246,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.4)"; }}
                >
                  <i className="fas fa-arrow-right mr-2" />
                  Get Started
                </button>
                <a href="#iso-standards">
                  <button style={{
                    padding: "14px 32px", borderRadius: 12, cursor: "pointer",
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
                    color: "#e2e8f0", fontSize: 15, fontWeight: 600,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                  >
                    Learn More
                  </button>
                </a>
              </div>
            </div>

            {/* Right — floating module grid card */}
            <div className="hidden lg:flex justify-center">
              <div style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 20, padding: 28,
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                width: "100%", maxWidth: 440,
              }}>
                <p style={{ color: "rgba(147,197,253,0.7)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 16px", fontWeight: 600 }}>
                  Active Modules
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {MODULES.map(m => (
                    <div key={m.label} title={m.label} style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12, padding: "12px 8px",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 8,
                        background: `${m.color}22`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <i className={`fas ${m.icon}`} style={{ fontSize: 14, color: m.color }} />
                      </div>
                      <span style={{ fontSize: 9, color: "rgba(148,163,184,0.8)", textAlign: "center", lineHeight: 1.2, fontWeight: 500 }}>
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Mini stats inside card */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
                  {[
                    { val: "18+", lbl: "Modules" },
                    { val: "3",   lbl: "ISO Standards" },
                    { val: "360°", lbl: "Coverage" },
                  ].map(s => (
                    <div key={s.lbl} style={{
                      background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                      borderRadius: 10, padding: "10px 8px", textAlign: "center",
                    }}>
                      <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>{s.val}</p>
                      <p style={{ fontSize: 10, color: "rgba(147,197,253,0.7)", margin: "2px 0 0" }}>{s.lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${s.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <i className={`fas ${s.icon}`} style={{ fontSize: 20, color: s.color }} />
                </div>
                <div>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#1e3a5f", margin: 0, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE ── */}
      <section id="about" style={{ background: "linear-gradient(180deg, #fff 0%, #f8fafc 100%)", padding: "80px 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: "#3b82f6", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>
              Why Isosofts
            </p>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: "#1e3a5f", margin: "0 0 12px" }}>
              Built for compliance excellence
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 560, margin: "0 auto" }}>
              Streamline your ISO compliance journey with a comprehensive suite of tools designed for efficiency and real results.
            </p>
          </div>
          <div style={{ display: "grid", gap: 24 }} className="md:grid-cols-3">
            {[
              { icon: "fa-shield-halved", color: "#3b82f6", title: "Risk Management", desc: "Comprehensive risk assessment tools to keep your organisation compliant, safe, and audit-ready at all times." },
              { icon: "fa-chart-line",    color: "#8b5cf6", title: "KPI / OPI Analytics", desc: "Real-time performance dashboards and visual indicators to track progress against annual targets across all functions." },
              { icon: "fa-users",         color: "#10b981", title: "Team Collaboration", desc: "Role-based access lets every team member contribute to compliance initiatives — from front-line staff to management." },
            ].map(f => (
              <div key={f.title} style={{
                background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
                padding: 32, transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#bfdbfe"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${f.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <i className={`fas ${f.icon}`} style={{ fontSize: 22, color: f.color }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", margin: "0 0 10px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ISO STANDARDS ── */}
      <section id="iso-standards" style={{ background: "#f8fafc", padding: "80px 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: "#3b82f6", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>
              Certifications
            </p>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: "#1e3a5f", margin: "0 0 12px" }}>
              Three ISO standards, one platform
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 560, margin: "0 auto" }}>
              Algebra covers the full scope of ISO 9001, ISO 14001, and ISO 45001 — so you manage all standards without switching between systems.
            </p>
          </div>

          <div style={{ display: "grid", gap: 24 }} className="lg:grid-cols-3">
            {ISO_STANDARDS.map(iso => (
              <div key={iso.code} style={{
                background: "#fff", border: `1px solid ${iso.border}`,
                borderRadius: 16, padding: 32, display: "flex", flexDirection: "column", gap: 16,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: iso.bg, border: `1px solid ${iso.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={`fas ${iso.icon}`} style={{ fontSize: 20, color: iso.color }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: iso.color, letterSpacing: "0.08em" }}>{iso.code}</span>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>{iso.title}</p>
                  </div>
                </div>

                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{iso.desc}</p>

                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Covered Modules</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {iso.modules.map(m => (
                      <span key={m} style={{
                        padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500,
                        background: iso.bg, color: iso.color, border: `1px solid ${iso.border}`,
                      }}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ background: "#fff", padding: "80px 0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: "#3b82f6", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>
              Our Products
            </p>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: "#1e3a5f", margin: 0 }}>
              The Isosofts Suite
            </h2>
          </div>
          <div style={{ display: "grid", gap: 24 }} className="md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(s => (
              <div key={s.name} style={{
                background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 28,
                display: "flex", flexDirection: "column", gap: 14,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#bfdbfe"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`fas ${s.icon}`} style={{ fontSize: 20, color: "#3b82f6" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", margin: "0 0 6px" }}>{s.name}</h3>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
                <button
                  onClick={s.action}
                  disabled={s.label === "Coming Soon"}
                  style={{
                    padding: "9px 16px", borderRadius: 10, border: "none", cursor: s.label === "Coming Soon" ? "default" : "pointer",
                    background: s.label === "Coming Soon" ? "#f1f5f9" : "linear-gradient(135deg, #3b82f6, #6366f1)",
                    color: s.label === "Coming Soon" ? "#94a3b8" : "#fff",
                    fontSize: 13, fontWeight: 600, transition: "opacity 0.2s",
                  }}
                >
                  {s.label === "Coming Soon" ? <><i className="fas fa-clock mr-1.5" />Coming Soon</> : <><i className="fas fa-arrow-right mr-1.5" />{s.label}</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", color: "#fff", padding: "64px 0 32px" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ display: "grid", gap: 40 }} className="md:grid-cols-4">

            {/* Brand */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>I</span>
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Isosofts</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(148,163,184,0.8)", lineHeight: 1.7, margin: 0 }}>
                Empowering organisations with intelligent ISO management solutions for a compliant and efficient future.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                {["ISO 9001", "ISO 14001", "ISO 45001"].map(b => (
                  <span key={b} style={{ padding: "2px 8px", borderRadius: 99, border: "1px solid rgba(59,130,246,0.4)", color: "#93c5fd", fontSize: 10, fontWeight: 600, background: "rgba(59,130,246,0.1)" }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Quick Links</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {["Home", "Services", "About", "Contact"].map(l => (
                  <li key={l}><a href="#" style={{ color: "rgba(148,163,184,0.8)", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(148,163,184,0.8)"}
                  >{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Services</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {["Risk Management", "ISO Compliance", "KPI Analytics", "Document Control"].map(l => (
                  <li key={l}><a href="#" style={{ color: "rgba(148,163,184,0.8)", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(148,163,184,0.8)"}
                  >{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Contact</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: "fa-envelope",         text: "info@isosofts.com" },
                  { icon: "fa-globe",             text: "www.isosofts.com" },
                  { icon: "fa-map-marker-alt",    text: "Baku, Azerbaijan" },
                ].map(c => (
                  <div key={c.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <i className={`fas ${c.icon}`} style={{ fontSize: 12, color: "#93c5fd" }} />
                    </div>
                    <span style={{ fontSize: 14, color: "rgba(148,163,184,0.8)" }}>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 48, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 13, color: "rgba(148,163,184,0.6)", margin: 0 }}>
              © {new Date().getFullYear()} Isosofts. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy", "Terms of Service"].map(l => (
                <a key={l} href="#" style={{ fontSize: 13, color: "rgba(148,163,184,0.6)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(148,163,184,0.6)"}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default IsosoftsMain;
