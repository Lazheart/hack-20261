import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { businessService } from "../services/business.service";
import  type { Business, Report } from "../types";

export default function Dashboard() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  
  const { logout } = useAuth();
  
  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const data = await businessService.getAll();
        setReports(data as unknown as Report[]);
        if (data.length > 0) setTotal(data.length);
      } catch (err) {
        console.error("Error cargando negocios:", err);
      }
    };
    loadBusinesses();
  }, []);

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
        const data = await businessService.create(business);
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

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* NAV */}
      <nav style={{ background: "white", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <span style={{ fontSize: "20px", fontWeight: "800", color: "#16a34a" }}>🏪 EasyCommerce</span>
        <button
          onClick={handleLogout}
          style={{ background: "transparent", border: "1px solid #e2e8f0", color: "#64748b", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}
        >
          Cerrar sesión
        </button>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
          Panel de Análisis
        </h1>
        <p style={{ color: "#64748b", marginBottom: "40px" }}>Sube tu CSV y analiza múltiples negocios con IA</p>

        {/* UPLOAD */}
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", marginBottom: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "2px dashed #e2e8f0", textAlign: "center" }}>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFileUpload} style={{ display: "none" }} />
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📁</div>
          <button
            onClick={() => fileRef.current?.click()}
            style={{ background: "#16a34a", color: "white", border: "none", padding: "12px 28px", borderRadius: "10px", fontSize: "15px", fontWeight: "bold", cursor: "pointer" }}
          >
            Seleccionar CSV
          </button>

          {fileName && (
            <p style={{ color: "#16a34a", fontWeight: "bold", margin: "12px 0 0" }}>
              ✅ {fileName} — {businesses.length} negocios cargados
            </p>
          )}

          {businesses.length > 0 && !processing && (
            <button
              onClick={processBusinesses}
              style={{ display: "block", width: "100%", marginTop: "20px", background: "#f97316", color: "white", border: "none", padding: "14px", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
            >
              🤖 Analizar {businesses.length} Negocios con IA
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
        <div style={{ background: "#0f172a", borderRadius: "12px", padding: "20px", marginBottom: "32px" }}>
          <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px" }}>📋 Ejemplo de CSV:</p>
          <pre style={{ color: "#86efac", fontSize: "11px", margin: 0, overflow: "auto" }}>
{`nombre,rubro,direccion,tiene_redes,acepta_pagos_digitales,inventario_digital
Bodega Don Carlos,abarrotes,Av. Universitaria 234 Ate,no,no,no
Pollería El Gordo,restaurante,Jr. Lima 45 Miraflores,facebook,yape,no
Salón Belinda,peluquería,Av. Túpac 89 SJL,instagram,no,no`}
          </pre>
        </div>

        {/* RESULTS */}
        {reports.length > 0 && (
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>
              📊 Resultados — {reports.length}/{total} analizados
            </h2>
            <div style={{ display: "grid", gap: "16px" }}>
              {reports.map((report, i) => {
                const level = getLevel(report.digitalMaturityScore || 0);
                return (
                  <div key={i} style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                      <div>
                        <h3 style={{ margin: "0 0 6px", color: "#0f172a", fontSize: "18px" }}>{report.nombre || `Negocio ${i + 1}`}</h3>
                        <span style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                          {level.emoji} Nivel {level.label}
                        </span>
                      </div>
                      <div style={{ textAlign: "center", background: "#f8fafc", borderRadius: "12px", padding: "12px 20px", border: "2px solid #e2e8f0" }}>
                        <div style={{ fontSize: "32px", fontWeight: "900", color: getScoreColor(report.digitalMaturityScore || 0) }}>
                          {report.digitalMaturityScore || 0}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "bold" }}>SCORE DIGITAL</div>
                      </div>
                    </div>

                    {report.summary && (
                      <p style={{ margin: "16px 0 0", color: "#64748b", fontSize: "14px", lineHeight: "1.7" }}>{report.summary}</p>
                    )}

                    {report.priorityActions?.length > 0 && (
                      <div style={{ marginTop: "16px", background: "#f8fafc", borderRadius: "10px", padding: "16px" }}>
                        <p style={{ margin: "0 0 10px", color: "#f97316", fontWeight: "bold", fontSize: "13px" }}>⚡ Acciones Prioritarias:</p>
                        {report.priorityActions.slice(0, 3).map((action: string, j: number) => (
                          <div key={j} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
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
        )}
      </div>
    </div>
  );
}