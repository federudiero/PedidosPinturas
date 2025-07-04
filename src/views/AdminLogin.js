import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === "admin123") {
      localStorage.setItem("adminAutenticado", "true");
      navigate("/admin/pedidos");
    } else {
      alert("❌ Contraseña incorrecta");
    }
  };

  return (
    <div className="container py-5">
    
      <h2 className="mb-4">🔐 Acceso Administrador</h2>
      <input
        type="password"
        className="form-control mb-3"
        placeholder="Ingresá la contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleLogin();
        }}
      />
      
      <button type="button" className="btn btn-primary " onClick={handleLogin}>
        Ingresar
      </button>
      
       <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
    ⬅ Volver a zona de pedidos
  </button>
    </div>
  );
}

export default AdminLogin;
