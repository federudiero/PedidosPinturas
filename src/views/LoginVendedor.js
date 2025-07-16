import React, { useState } from "react";
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./LoginVendedor.css";

const vendedoresPermitidos = [
  "federudiero@gmail.com",
  "andreitarudiero@gmail.com",
  "vendedor2@gmail.com"
];

function LoginVendedor() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;

      if (vendedoresPermitidos.includes(email)) {
        localStorage.setItem("vendedorAutenticado", "true");
        localStorage.setItem("emailVendedor", email);
        navigate("/vendedor");
      } else {
        setError("❌ Este correo no está autorizado como vendedor.");
        await auth.signOut();
      }
    } catch (error) {
      setError("❌ Error al iniciar sesión con Google.");
      console.error(error);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="card login-card p-4 shadow-lg">
        <h3 className="text-center mb-4">🛒 Acceso de Vendedor</h3>

        <button className="btn btn-danger w-100 mb-3" onClick={handleGoogleLogin}>
          🚀 Iniciar sesión con Google
        </button>

        <button className="btn btn-outline-secondary w-100" onClick={() => navigate("/")}>
          ⬅ Volver al inicio
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default LoginVendedor;
