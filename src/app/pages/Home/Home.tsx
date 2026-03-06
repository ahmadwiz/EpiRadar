import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Orb from "@/components/Orb";

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => navigate("/login");
  const handlePortal = () => navigate("/portal");

  return (
    <div>
      {/* HERO */}
      <section className="relative w-full h-[80vh] min-h-[520px]" id="home">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[900px] h-[900px] -translate-y-10">
            <Orb hue={96} hoverIntensity={0.3} rotateOnHover forceHoverState={true} />
          </div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center pointer-events-none">
          <div className="text-center max-w-xl px-4">
            <h1 style={{
              fontSize: "clamp(3.5rem, 8vw, 6rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}>
              <span style={{ color: "#111" }}>Epi</span>
              <span style={{
                background: "linear-gradient(135deg, #a8edcb 0%, #5dd9a0 25%, #3ec98a 50%, #6ece4a 75%, #4aad2a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>Radar</span>
            </h1>
            <p className="mt-4 text-neutral-600">
              Predict outbreak hotspots, estimate hospital resource needs, and route resources with minimal manual effort.
            </p>

            <div className="mt-6 flex items-center justify-center gap-4">
              {/* Sign in → /login, unless already logged in */}
              <button
                onClick={handleSignIn}
                className="pointer-events-auto inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white"
              >
                {user ? (user.role === "hospital" ? "Dashboard" : "My Portal") : "Sign in"}
              </button>
              {/* Public Portal → /register for new users, /portal if logged in */}
              <button
                onClick={handlePortal}
                className="pointer-events-auto inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold"
              >
                Public Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section
        id="about"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f7f8f7 100%)",
          position: "relative",
          overflow: "hidden",
          padding: "120px 48px",
          marginTop: "30px",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ position: "absolute", top: "-160px", right: "-160px", width: "640px", height: "640px", borderRadius: "50%", background: "radial-gradient(circle, rgba(110,206,74,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-160px", left: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(110,206,74,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
            <div style={{ width: "24px", height: "2px", background: "#6ece4a" }} />
            <span style={{ color: "#6ece4a", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>About the Platform</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start", marginBottom: "80px" }}>
            <div>
              <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, color: "#111", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "28px" }}>
                Predicting outbreaks<br />
                <span style={{ color: "#4aad2a" }}>before they happen.</span>
              </h2>
              <p style={{ color: "#6b7280", lineHeight: 1.9, fontSize: "16px", marginBottom: "36px" }}>
                EpiRadar is a state-of-the-art AI-driven platform designed to monitor, predict, and mitigate the spread of infectious diseases. By aggregating anonymized hospital data and applying advanced spatial clustering, we provide real-time insights into emerging health threats — days before traditional systems catch them.
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["AI-Powered", "HIPAA Compliant", "Real-time Data"].map((tag, i) => (
                  <div key={i} style={{ padding: "9px 18px", borderRadius: "999px", background: i === 0 ? "#f0faf0" : "#f9fafb", border: i === 0 ? "1px solid #d4edcf" : "1px solid #e5e7eb", color: i === 0 ? "#4aad2a" : "#6b7280", fontSize: "13px", fontWeight: 600 }}>{tag}</div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Real-time hotspot detection", desc: "Identify clusters of symptoms days before traditional reporting catches them. Our spatial clustering engine processes millions of anonymized data points continuously." },
                { label: "Resource allocation forecasting", desc: "Predict exactly which medical supplies are needed at which hospitals — up to 72 hours in advance — so nothing runs out when it matters most." },
                { label: "Public health communication", desc: "Keep communities informed with transparent, targeted advisories that are accurate, timely, and calibrated to local risk levels." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "18px", padding: "24px 28px", borderRadius: "16px", background: i === 0 ? "#f0faf0" : "#f9fafb", border: i === 0 ? "1px solid #d4edcf" : "1px solid #f0f0f0" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: i === 0 ? "#e8f5e4" : "#efefef", color: i === 0 ? "#4aad2a" : "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>✓</div>
                  <div>
                    <div style={{ color: "#111", fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>{item.label}</div>
                    <div style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.7 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
              <div style={{ width: "24px", height: "2px", background: "#6ece4a" }} />
              <span style={{ color: "#6ece4a", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>How It Works</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr", alignItems: "center" }}>
              {[
                { step: "01", label: "Data Ingestion", desc: "Anonymized symptom reports and hospital intake data stream in continuously from partner networks.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> },
                { step: "02", label: "Spatial Clustering", desc: "Our AI engine maps symptom density across geographies, identifying anomalous clusters in real time.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg> },
                { step: "03", label: "Risk Scoring", desc: "Each cluster is assigned a risk score based on growth rate, population density, and historical patterns.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
                { step: "04", label: "Alert & Action", desc: "Hospitals and health officials receive targeted alerts with resource recommendations before surges hit.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
              ].map((item, i) => (
                <>
                  <div key={item.step} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "28px 24px", display: "flex", flexDirection: "column", gap: "12px", transition: "box-shadow 0.2s, border-color 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.07)"; e.currentTarget.style.borderColor = "#d4edcf"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#f0faf0", color: "#4aad2a", display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</div>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#d1d5db", letterSpacing: "0.08em" }}>{item.step}</span>
                    </div>
                    <div style={{ color: "#111", fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em" }}>{item.label}</div>
                    <div style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.65 }}>{item.desc}</div>
                  </div>
                  {i < 3 && (
                    <div key={`arrow-${i}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PURPOSE SECTION ── */}
      <section id="purpose" style={{ background: "#f3f4f6", padding: "120px 48px", position: "relative", overflow: "hidden", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ position: "absolute", bottom: "-160px", left: "-160px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(110,206,74,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "24px", height: "2px", background: "#6ece4a" }} />
              <span style={{ color: "#6ece4a", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Our Purpose</span>
              <div style={{ width: "24px", height: "2px", background: "#6ece4a" }} />
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, color: "#111", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "16px" }}>
              Proactive intelligence for<br />a healthier world.
            </h2>
            <p style={{ color: "#6b7280", fontSize: "15px", maxWidth: "520px", margin: "0 auto", lineHeight: 1.85 }}>
              To empower healthcare systems and communities with predictive intelligence, enabling proactive responses before outbreaks become epidemics.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, label: "Early Detection", desc: "Identifying anomalous clusters of symptoms days before traditional reporting methods catch them.", stat: "3–5 days", statLabel: "earlier than standard reporting" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label: "Resource Efficiency", desc: "Ensuring hospitals have the right supplies at the right time to handle predicted patient surges.", stat: "40%", statLabel: "reduction in supply waste" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: "Public Safety", desc: "Keeping communities informed with transparent, actionable health advisories and prevention tips.", stat: "Real-time", statLabel: "advisory broadcasts" },
            ].map((card, i) => (
              <div key={i} style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "32px", display: "flex", flexDirection: "column", gap: "16px", transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#d4edcf"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
              >
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#f0faf0", color: "#4aad2a", display: "flex", alignItems: "center", justifyContent: "center" }}>{card.icon}</div>
                <div>
                  <div style={{ color: "#111", fontWeight: 700, fontSize: "16px", letterSpacing: "-0.02em", marginBottom: "8px" }}>{card.label}</div>
                  <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.75 }}>{card.desc}</p>
                </div>
                <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid #f3f4f6" }}>
                  <div style={{ color: "#4aad2a", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.03em" }}>{card.stat}</div>
                  <div style={{ color: "#9ca3af", fontSize: "11px", marginTop: "3px", letterSpacing: "0.04em", textTransform: "uppercase" }}>{card.statLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-400 text-sm font-medium border-t border-slate-100">
        &copy; {new Date().getFullYear()} EpiRadar. All rights reserved.
      </footer>
    </div>
  );
}