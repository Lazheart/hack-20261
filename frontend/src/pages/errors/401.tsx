import { useNavigate } from "react-router-dom";

export default function Error401() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
        <h1 style={{ fontSize: "64px", fontWeight: "900", color: "#ef4444", margin: "0 0 16px" }}>401</h1>
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px" }}>No autorizado</h2>
        <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "32px", lineHeight: "1.6" }}>
          Tu sesión ha expirado o no tienes acceso. Por favor, inicia sesión nuevamente.
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{ width: "100%", background: "#16a34a", color: "white", border: "none", padding: "14px", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
        >
          Ir a Iniciar Sesión
        </button>
      </div>
    </div>
  );
}
