import { useNavigate } from "react-router-dom";

export default function ComoFunciona() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ background: "white", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <span onClick={() => navigate("/")} style={{ fontSize: "22px", fontWeight: "800", color: "#16a34a", cursor: "pointer" }}>EasyCommerce</span>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <span onClick={() => navigate("/login")} style={{ color: "#64748b", fontSize: "15px", cursor: "pointer" }}>Iniciar Sesión</span>
          <span onClick={() => navigate("/register")} style={{ background: "#f97316", color: "white", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>Comenzar Gratis</span>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", padding: "60px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "40px", fontWeight: "900", color: "#0f172a", margin: "0 0 16px" }}>
          Cómo usar EasyCommerce
        </h1>
        <p style={{ fontSize: "18px", color: "#64748b", maxWidth: "600px", margin: "0 auto", lineHeight: "1.7" }}>
          En tres simples pasos, obtén un diagnóstico completo y un plan de digitalización personalizado para cada uno de tus negocios.
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 20px" }}>

        {/* PASOS */}
        <div style={{ display: "grid", gap: "24px", marginBottom: "48px" }}>
          {[
            {
              paso: "01",
              titulo: "Crea tu cuenta",
              desc: "Regístrate gratis con tu nombre, correo y contraseña. No necesitas tarjeta de crédito ni conocimientos técnicos.",
            },
            {
              paso: "02",
              titulo: "Prepara tu archivo CSV",
              desc: "Crea un archivo CSV con la información de tus negocios. Cada fila es un negocio. Las columnas que necesitas son: nombre, rubro, dirección, si tiene redes sociales, si acepta pagos digitales y si lleva inventario digital.",
            },
            {
              paso: "03",
              titulo: "Sube el CSV y analiza",
              desc: "Desde tu panel, sube el archivo CSV y haz click en Analizar. Nuestra inteligencia artificial procesará cada negocio de forma automática y generará un diagnóstico personalizado para cada uno.",
            },
            {
              paso: "04",
              titulo: "Revisa los resultados",
              desc: "Verás los resultados en tiempo real conforme se van procesando. Cada negocio tendrá su score de digitalización, las herramientas que necesita y un plan de acción semana a semana.",
            },
          ].map((item, i) => (
            <div key={i} style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", gap: "24px", alignItems: "flex-start" }}>
              <div style={{ background: "#dcfce7", color: "#16a34a", borderRadius: "12px", padding: "12px 16px", fontWeight: "900", fontSize: "22px", minWidth: "64px", textAlign: "center" }}>
                {item.paso}
              </div>
              <div>
                <h3 style={{ margin: "0 0 10px", color: "#0f172a", fontSize: "20px", fontWeight: "700" }}>{item.titulo}</h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "15px", lineHeight: "1.8" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* EJEMPLO CSV */}
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", marginBottom: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Ejemplo de archivo CSV</h2>
          <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "20px", lineHeight: "1.7" }}>
            Así debe verse tu archivo CSV. Puedes crearlo en Excel o Google Sheets y exportarlo como CSV.
          </p>
          <div style={{ background: "#0f172a", borderRadius: "12px", padding: "20px" }}>
            <pre style={{ color: "#86efac", fontSize: "12px", margin: 0, overflow: "auto", lineHeight: "1.8" }}>
{`nombre,rubro,direccion,tiene_redes,acepta_pagos_digitales,inventario_digital
Bodega Don Carlos,abarrotes,Av. Universitaria 234 Ate,no,no,no
Pollería El Gordo,restaurante,Jr. Lima 45 Miraflores,facebook,yape,no
Salón Belinda,peluquería,Av. Túpac 89 SJL,instagram,no,no
Farmacia San José,farmacia,Av. Callao 123,facebook,yape,si
Librería El Saber,librería,Jr. Cusco 45 Lima,no,no,no`}
            </pre>
          </div>
        </div>

        {/* QUE RECIBES */}
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", marginBottom: "48px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "24px" }}>Qué recibes por cada negocio</h2>
          <div style={{ display: "grid", gap: "16px" }}>
            {[
              { titulo: "Score de digitalización", desc: "Un puntaje del 0 al 100 que indica qué tan digitalizado está el negocio actualmente." },
              { titulo: "Nivel de madurez digital", desc: "Clasificación en Inicial, Básico, Intermedio o Avanzado según el estado actual del negocio." },
              { titulo: "Diagnóstico personalizado", desc: "Un resumen claro de la situación actual del negocio y qué áreas necesita mejorar." },
              { titulo: "Herramientas recomendadas", desc: "Lista específica de herramientas gratuitas o de bajo costo adaptadas al tipo y tamaño del negocio." },
              { titulo: "Plan de acción por semanas", desc: "Un roadmap concreto con tareas ordenadas por prioridad para que el comerciante sepa exactamente qué hacer primero." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
                <div style={{ color: "#16a34a", fontWeight: "900", fontSize: "18px", minWidth: "24px" }}>→</div>
                <div>
                  <p style={{ margin: "0 0 4px", color: "#0f172a", fontWeight: "700", fontSize: "15px" }}>{item.titulo}</p>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "white", margin: "0 0 16px" }}>
            Listo para empezar
          </h2>
          <p style={{ color: "#dcfce7", fontSize: "16px", margin: "0 0 32px", lineHeight: "1.7" }}>
            Crea tu cuenta gratis y analiza hasta 25 negocios en minutos.
          </p>
          <button
            onClick={() => navigate("/register")}
            style={{ background: "white", color: "#16a34a", border: "none", padding: "14px 36px", borderRadius: "10px", fontSize: "16px", fontWeight: "800", cursor: "pointer" }}
          >
            Crear Cuenta Gratis
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", color: "#94a3b8", textAlign: "center", padding: "32px", fontSize: "13px" }}>
        <p style={{ margin: 0 }}>2026 EasyCommerce AI — Transformación Digital para MYPES peruanas</p>
      </footer>
    </div>
  );
}