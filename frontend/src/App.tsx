import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Lightbulb, MapPin, Upload } from "lucide-react";

const API_URL = "https://89vw70b8uf.execute-api.us-east-1.amazonaws.com/dev";

interface Business {
  nombre: string;
  rubro: string;
  direccion: string;
  tiene_redes: string;
  acepta_pagos_digitales: string;
  inventario_digital: string;
}

interface Report {
  businessId: string;
  nombre: string;
  digitalMaturityScore: number;
  maturityLevel: string;
  summary: string;
  recommendations: any[];
  priorityActions: string[];
  quickWins: string[];
}

export default function App() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const parseCSV = (text: string): Business[] => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const obj: any = {};
      headers.forEach((h, i) => (obj[h] = values[i] || ""));
      return obj;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const parsed = parseCSV(text);
      setBusinesses(parsed);
    };
    reader.readAsText(file);
  };

  const processBusinesses = async () => {
    if (businesses.length === 0) return;
    setProcessing(true);
    setProgress(0);
    setTotal(businesses.length);
    setReports([]);
    for (let i = 0; i < businesses.length; i++) {
      const business = businesses[i];
      try {
        const res = await fetch(`${API_URL}/businesses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(business),
        });
        const data = await res.json();
        setReports((prev) => [...prev, { ...data, nombre: business.nombre }]);
      } catch (err) {
        console.error("Error:", err);
      }
      setProgress(i + 1);
      await new Promise((r) => setTimeout(r, 500));
    }
    setProcessing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "#22c55e";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getLevel = (score: number) => {
    if (score >= 70) return { emoji: "🟢", label: "Alto" };
    if (score >= 40) return { emoji: "🟡", label: "Medio" };
    return { emoji: "🔴", label: "Bajo" };
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ background: "white", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <span style={{ fontSize: "22px", fontWeight: "800", color: "#16a34a" }}>EasyCommerce</span>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <span onClick={() => navigate("/como-funciona")} style={{ color: "#64748b", fontSize: "15px", cursor: "pointer" }}>Cómo Funciona</span>
          <span onClick={() => navigate("/login")} style={{ color: "#64748b", fontSize: "15px", cursor: "pointer" }}>Iniciar Sesión</span>
          <span onClick={() => navigate("/register")} style={{ background: "#f97316", color: "white", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>Comenzar Gratis</span>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", padding: "80px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "#dcfce7", color: "#16a34a", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold", marginBottom: "24px" }}>
            Impulsado por Inteligencia Artificial
          </div>
          <h1 style={{ fontSize: "48px", fontWeight: "900", color: "#0f172a", margin: "0 0 20px", lineHeight: "1.1" }}>
            Transforma tu MYPE con <span style={{ color: "#16a34a" }}>Inteligencia Artificial</span>
          </h1>
          <p style={{ fontSize: "18px", color: "#64748b", margin: "0 0 40px", lineHeight: "1.6" }}>
            Sube tus datos en CSV y nuestra IA genera un diagnóstico personalizado, recomendaciones de herramientas digitales y un roadmap semana a semana para cada negocio.
          </p>
          <button
            onClick={() => navigate("/register")}
            style={{ background: "#f97316", color: "white", border: "none", padding: "16px 36px", borderRadius: "12px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 14px rgba(249,115,22,0.4)" }}
          >
            Comenzar Gratis — Sube tu CSV
          </button>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "12px" }}>Sin tarjetas de crédito. Tu privacidad es nuestra prioridad.</p>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: "80px 40px", background: "white" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
          {[
            { icon: <TrendingUp size={40} color="#16a34a" strokeWidth={1.5} />, title: "Análisis al Instante", desc: "Procesamos hasta 25 negocios en paralelo con arquitectura serverless en AWS." },
            { icon: <Lightbulb size={40} color="#f97316" strokeWidth={1.5} />, title: "Recomendaciones Claras", desc: "Nuestra IA te da herramientas específicas como Yape, Loyverse, Google Maps y más." },
            { icon: <MapPin size={40} color="#6366f1" strokeWidth={1.5} />, title: "Roadmap Personalizado", desc: "Plan semana a semana adaptado al nivel digital de cada negocio." },
          ].map((f, i) => (
            <div key={i} style={{ background: "#f8fafc", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
              <div style={{ marginBottom: "16px" }}>{f.icon}</div>
              <h3 style={{ margin: "0 0 12px", color: "#0f172a", fontSize: "18px" }}>{f.title}</h3>
              <p style={{ margin: 0, color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* UPLOAD SECTION */}
      <div style={{ padding: "80px 40px", background: "#f8fafc" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
            Sube tu archivo CSV
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: "40px" }}>
            El CSV debe tener las columnas: nombre, rubro, direccion, tiene_redes, acepta_pagos_digitales, inventario_digital
          </p>

          <div style={{ background: "white", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "2px dashed #e2e8f0", textAlign: "center" }}>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleFileUpload} style={{ display: "none" }} />
            <div style={{ marginBottom: "16px" }}>
  <Upload size={48} color="#16a34a" strokeWidth={1.5} />
</div>
            <button
              onClick={() => fileRef.current?.click()}
              style={{ background: "#16a34a", color: "white", border: "none", padding: "12px 28px", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginBottom: "16px" }}
            >
              Seleccionar CSV
            </button>
            {fileName && (
              <p style={{ color: "#16a34a", fontWeight: "bold", margin: "8px 0" }}>✅ {fileName} — {businesses.length} negocios cargados</p>
            )}
            {businesses.length > 0 && !processing && (
              <button
                onClick={processBusinesses}
                style={{ display: "block", width: "100%", marginTop: "20px", background: "#f97316", color: "white", border: "none", padding: "14px", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
              >
                Analizar {businesses.length} Negocios con IA
              </button>
            )}
            {processing && (
              <div style={{ marginTop: "20px" }}>
                <p style={{ color: "#64748b", fontWeight: "bold" }}>Procesando {progress}/{total} negocios...</p>
                <div style={{ background: "#e2e8f0", borderRadius: "8px", height: "10px", overflow: "hidden", marginTop: "8px" }}>
                  <div style={{ background: "#16a34a", height: "100%", width: `${(progress / total) * 100}%`, transition: "width 0.3s", borderRadius: "8px" }} />
                </div>
                <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "8px" }}>{Math.round((progress / total) * 100)}% completado</p>
              </div>
            )}
          </div>

          {/* CSV EXAMPLE */}
          <div style={{ marginTop: "24px", background: "#0f172a", borderRadius: "12px", padding: "20px" }}>
            <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "12px" }}>Ejemplo de CSV:</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px", marginBottom: "6px" }}>
              {["nombre", "rubro", "direccion", "tiene_redes", "acepta_pagos_digitales", "inventario_digital"].map((col, i) => (
                <div key={i} style={{ background: "#16a34a", color: "white", padding: "8px 4px", borderRadius: "6px", fontSize: "9px", fontWeight: "700", textAlign: "center" }}>
                  {col}
                </div>
              ))}
            </div>
            {[
              ["Bodega Don Carlos", "abarrotes", "Av. Universitaria 234", "no", "no", "no"],
              ["Pollería El Gordo", "restaurante", "Jr. Lima 45 Miraflores", "facebook", "yape", "no"],
              ["Salón Belinda", "peluquería", "Av. Túpac 89 SJL", "instagram", "no", "no"],
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px", marginBottom: "4px" }}>
                {row.map((cell, j) => (
                  <div key={j} style={{ background: i % 2 === 0 ? "#1e293b" : "#0f172a", border: "1px solid #334155", padding: "8px 4px", borderRadius: "4px", fontSize: "9px", color: cell === "no" ? "#ef4444" : cell === "si" ? "#22c55e" : "#94a3b8", fontWeight: cell === "no" || cell === "si" ? "700" : "400", textAlign: "center" }}>
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS */}
      {reports.length > 0 && (
        <div style={{ padding: "60px 40px", background: "white" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: "800", color: "#0f172a", marginBottom: "40px" }}>
              Resultados — {reports.length}/{total} negocios analizados
            </h2>
            <div style={{ display: "grid", gap: "20px" }}>
              {reports.map((report, i) => {
                const level = getLevel(report.digitalMaturityScore || 0);
                return (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: "16px", padding: "28px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                      <div>
                        <h3 style={{ margin: "0 0 4px", color: "#0f172a", fontSize: "20px" }}>{report.nombre || `Negocio ${i + 1}`}</h3>
                        <span style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                          {level.emoji} Nivel {level.label}
                        </span>
                      </div>
                      <div style={{ textAlign: "center", background: "white", borderRadius: "12px", padding: "12px 20px", border: "2px solid #e2e8f0" }}>
                        <div style={{ fontSize: "36px", fontWeight: "900", color: getScoreColor(report.digitalMaturityScore || 0) }}>
                          {report.digitalMaturityScore || 0}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "bold" }}>SCORE DIGITAL</div>
                      </div>
                    </div>
                    {report.summary && (
                      <p style={{ margin: "16px 0 0", color: "#64748b", fontSize: "14px", lineHeight: "1.7" }}>{report.summary}</p>
                    )}
                    {report.priorityActions?.length > 0 && (
                      <div style={{ marginTop: "16px", background: "white", borderRadius: "10px", padding: "16px", border: "1px solid #e2e8f0" }}>
                        <p style={{ margin: "0 0 10px", color: "#f97316", fontWeight: "bold", fontSize: "13px" }}>Acciones Prioritarias:</p>
                        {report.priorityActions.slice(0, 3).map((action: string, j: number) => (
                          <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                            <span style={{ color: "#16a34a", fontWeight: "bold" }}>→</span>
                            <span style={{ color: "#64748b", fontSize: "13px" }}>{action}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", color: "#94a3b8", textAlign: "center", padding: "32px", fontSize: "13px" }}>
        <p style={{ margin: 0 }}>2026 EasyCommerce AI — Transformación Digital para MYPES peruanas</p>
      </footer>
    </div>
  );
}