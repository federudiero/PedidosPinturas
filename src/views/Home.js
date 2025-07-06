// src/views/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4">📦 Sistema de Pedidos</h1>
      <p className="lead mb-5">Seleccioná tu tipo de acceso:</p>

      <div className="d-flex justify-content-center gap-4">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate("/login-vendedor")}
        >
          🧑 Ingreso Vendedor
        </button>

        <button
          className="btn btn-dark btn-lg"
          onClick={() => navigate("/admin")}
        >
          🛠️ Ingreso Administrador
        </button>
      </div>
    </div>
  );
}

export default Home;
