import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Swal from "sweetalert2";
import "./LoginRepartidor.css"; // Asegurate de crear este archivo

const repartidoresPermitidos = [
  "repartidor1@gmail.com",
  "repartidor2@gmail.com",
  "repartidor3@gmail.com",
  "repartidor4@gmail.com",
];

function LoginRepartidor() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (repartidoresPermitidos.includes(user.user.email)) {
        localStorage.setItem("repartidorAutenticado", "true");
        localStorage.setItem("emailRepartidor", user.user.email);
        navigate("/repartidor");
      } else {
        Swal.fire("❌ No tenés permisos de repartidor");
      }
    } catch (err) {
      Swal.fire("❌ Error al ingresar: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const emailGoogle = result.user.email;

      if (repartidoresPermitidos.includes(emailGoogle)) {
        localStorage.setItem("repartidorAutenticado", "true");
        localStorage.setItem("emailRepartidor", emailGoogle);
        navigate("/repartidor");
      } else {
        Swal.fire("❌ No tenés permisos de repartidor con esta cuenta de Google");
      }
    } catch (error) {
      Swal.fire("❌ Error con Google: " + error.message);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="card login-card p-4 shadow-lg">
        <h3 className="text-center mb-4">🚚 Acceso Repartidor</h3>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
        />

        <div className="d-grid gap-2 mb-3">
          <button className="btn btn-primary" onClick={handleLogin}>
            🔐 Ingresar
          </button>
          <button className="btn btn-danger" onClick={handleGoogleLogin}>
            🚀 Ingresar con Google
          </button>
        </div>

        <button className="btn btn-outline-secondary w-100" onClick={() => navigate("/")}>
          ⬅ Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default LoginRepartidor;
