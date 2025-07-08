// src/views/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4 display-4 fw-bold">📦 Sistema de Pedidos</h1>
      <p className="lead mb-5">Seleccioná tu tipo de acceso</p>

      <div className="row justify-content-center g-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">🧑 Vendedor</h5>
              <p className="card-text">Ingresá para cargar nuevos pedidos.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/login-vendedor")}
              >
                Ingreso Vendedor
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">🛠️ Administrador</h5>
              <p className="card-text">Visualizá y gestioná todos los pedidos.</p>
              <button
                className="btn btn-dark"
                onClick={() => navigate("/admin")}
              >
                Ingreso Administrador
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">🚚 Repartidor</h5>
              <p className="card-text">Revisá entregas y generá reportes.</p>
              <button
                className="btn btn-success"
                onClick={() => navigate("/login-repartidor")}
              >
                Ingreso Repartidor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
