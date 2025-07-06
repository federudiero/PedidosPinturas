import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase"; // Asegurate que esté bien
import Swal from "sweetalert2";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const adminsPermitidos = ["federudiero@gmail.com", "admin2@mail.com", "admin3@mail.com"];

  const showAlert = (mensaje, icon = "error") => {
    Swal.fire({
      title: mensaje,
      icon,
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
    });
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (adminsPermitidos.includes(userCredential.user.email)) {
        localStorage.setItem("adminAutenticado", "true");
        navigate("/admin/pedidos");
      } else {
        showAlert("❌ No tenés permisos de administrador");
      }
    } catch (error) {
      showAlert("❌ Error al ingresar: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const emailGoogle = result.user.email;

      if (adminsPermitidos.includes(emailGoogle)) {
        localStorage.setItem("adminAutenticado", "true");
        navigate("/admin/pedidos");
      } else {
        showAlert("❌ No tenés permisos de administrador con esta cuenta de Google");
      }
    } catch (error) {
      showAlert("❌ Error con Google: " + error.message);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">🔐 Acceso Administrador</h2>

      <input
        type="email"
        className="form-control mb-3"
        placeholder="Correo del administrador"
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

      <button type="button" className="btn btn-primary me-2" onClick={handleLogin}>
        Ingresar
      </button>

      <hr />
      <button className="btn btn-danger" onClick={handleGoogleLogin}>
        Iniciar como Admin con Google 🚀
      </button>

      <button className="btn btn-outline-secondary mt-3" onClick={() => navigate("/")}>
        ⬅ Volver al inicio
      </button>
    </div>
  );
}

export default AdminLogin;
