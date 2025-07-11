// src/views/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Asegurate de crear este archivo

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container py-5 text-center fade-in">
     <img
  src="/paintface.jpg"
  alt="Logo de pintura"
  className="mb-4 animate-img rounded-circle shadow-custom"
  style={{ width: "180px", height: "180px", objectFit: "cover" }}
/>

      <h1 className="mb-4 display-4 fw-bold text-gradient">📦 Sistema de Pedidos</h1>
      <p className="lead mb-5">Seleccioná tu tipo de acceso</p>

      <div className="row justify-content-center g-4">
        {[
          {
            rol: "🧑 Vendedor",
            texto: "Ingresá para cargar nuevos pedidos.",
            btn: "Ingreso Vendedor",
            color: "primary",
            ruta: "/login-vendedor"
          },
          {
            rol: "🛠️ Administrador",
            texto: "Visualizá y gestioná todos los pedidos.",
            btn: "Ingreso Administrador",
            color: "dark",
            ruta: "/admin"
          },
          {
            rol: "🚚 Repartidor",
            texto: "Revisá entregas y generá reportes.",
            btn: "Ingreso Repartidor",
            color: "success",
            ruta: "/login-repartidor"
          }
        ].map(({ rol, texto, btn, color, ruta }, i) => (
          <div key={i} className="col-md-4">
            <div className="card custom-card h-100">
              <div className="card-body">
                <h5 className="card-title">{rol}</h5>
                <p className="card-text">{texto}</p>
                <button className={`btn btn-${color}`} onClick={() => navigate(ruta)}>
                  {btn}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
