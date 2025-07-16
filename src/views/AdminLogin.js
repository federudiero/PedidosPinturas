import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const correosAdmins = [
  "federudiero@gmail.com",
  "admin2@mail.com",
  "admin3@mail.com"
];

function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const iniciarSesion = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const resultado = await signInWithPopup(auth, provider);
      const email = resultado.user.email;

      if (correosAdmins.includes(email)) {
        localStorage.setItem("adminAutenticado", "true");
        navigate("/admin/pedidos");
      } else {
        setError("❌ Este usuario no está autorizado como administrador.");
        await auth.signOut(); // Cierra sesión si no es admin
      }
    } catch (err) {
      setError("❌ Error al iniciar sesión.");
      console.error(err);
    }
  };

  return (
    <div className="container text-center py-5">
      <h2>🔐 Acceso Administrador</h2>
      <p>Iniciá sesión con una cuenta autorizada para acceder a los pedidos.</p>

      <div className="d-grid gap-2 col-6 mx-auto mb-3">
        <button className="btn btn-dark" onClick={iniciarSesion}>
          Iniciar sesión con Google
        </button>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
          ⬅ Volver al inicio
        </button>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default AdminLogin;
