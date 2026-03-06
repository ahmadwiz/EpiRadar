import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = login(email, password);
    if (result.success) {
      navigate(result.role === "hospital" ? "/hospital/dashboard" : "/portal");
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "16px",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      color: "#000",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fade-up   { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes blob-move { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
        @keyframes spin      { to { transform:rotate(360deg); } }

        .epi-input {
          width: 100%; box-sizing: border-box;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 14px; font-weight: 500;
          font-family: inherit; color: #0f172a;
          outline: none;
          transition: all 0.2s;
        }
        .epi-input::placeholder { color: #94a3b8; }
        .epi-input:focus {
          border-color: #000;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.08);
          background: #fff;
        }
        .sign-btn {
          width: 100%; height: 48px;
          background: #000; color: #fff;
          border: none; border-radius: 12px;
          font-size: 15px; font-weight: 700;
          font-family: inherit; cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .sign-btn:hover:not(:disabled) { background: #1e293b; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.18); }
        .sign-btn:active:not(:disabled) { transform: translateY(0); }
        .sign-btn:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }
      `}</style>

      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "384px", height: "384px", borderRadius: "50%", background: "rgba(167,243,208,0.25)", filter: "blur(60px)", pointerEvents: "none", animation: "blob-move 9s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "384px", height: "384px", borderRadius: "50%", background: "rgba(191,219,254,0.22)", filter: "blur(60px)", pointerEvents: "none", animation: "blob-move 12s ease-in-out infinite reverse" }} />

      {/* Back to home */}
      <div style={{ position: "absolute", top: "28px", left: "28px", zIndex: 10 }}>
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#64748b", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#000")}
          onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "440px",
        background: "#fff",
        borderRadius: "28px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        padding: "48px",
        position: "relative", zIndex: 10,
        animation: "fade-up 0.45s cubic-bezier(0.22,1,0.36,1) forwards",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
          <div style={{ width: "56px", height: "56px", background: "#000000", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" fill="white" stroke="none"/>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
              <circle cx="12" cy="12" r="9" strokeOpacity="0.35"/>
            </svg>
          </div>
        </div>

        <h2 style={{ fontSize: "24px", fontWeight: 800, textAlign: "center", letterSpacing: "-0.03em", margin: "0 0 6px", color: "#0f172a" }}>Welcome back</h2>
        <p style={{ fontSize: "14px", color: "#64748b", textAlign: "center", margin: "0 0 28px", fontWeight: 500 }}>Enter your credentials to access the dashboard</p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>Email address</label>
            <input
              type="email"
              className="epi-input"
              placeholder="admin@hospital.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>Password</label>
              <a href="#" style={{ fontSize: "13px", fontWeight: 600, color: "#10b981", textDecoration: "none" }}>Forgot password?</a>
            </div>
            <input
              type="password"
              className="epi-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", fontSize: "13px", color: "#dc2626", display: "flex", alignItems: "center", gap: "7px", marginBottom: "16px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <button type="submit" className="sign-btn" disabled={loading} style={{ marginTop: "4px" }}>
            {loading
              ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Signing in…</>
              : "Sign in"
            }
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "#64748b", fontWeight: 500, margin: 0 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#000", fontWeight: 700, textDecoration: "none" }}>Request access</Link>
          </p>
        </div>
      </div>
    </div>
  );
}