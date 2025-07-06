import React, { useState } from "react";
import Swal from "sweetalert2";
import { auth, googleProvider } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function LoginVendedor() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const vendedoresPermitidos = ["federudiero@gmail.com", "vendedor2@gmail.com"];

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showAlert = (title, icon = "info") => {
    Swal.fire({
      title,
      icon,
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
    });
  };

  const handleLogin = async () => {
    if (!email || !password) return showAlert("📩 Ingresá email y contraseña", "warning");
    if (!isValidEmail(email)) return showAlert("❌ Correo no válido", "error");

    if (!vendedoresPermitidos.includes(email)) {
      return showAlert("❌ Este correo no está autorizado", "error");
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/vendedor");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        showAlert("❌ Usuario no encontrado", "error");
      } else if (error.code === "auth/wrong-password") {
        showAlert("❌ Contraseña incorrecta", "error");
      } else {
        showAlert("❌ " + error.message, "error");
      }
    }
  };

  const handleRegister = async () => {
    if (!email || !password) return showAlert("📩 Completá todos los campos", "warning");
    if (!isValidEmail(email)) return showAlert("❌ Correo no válido", "error");
    if (password.length < 6) return showAlert("🔐 La contraseña debe tener al menos 6 caracteres", "warning");

    if (!vendedoresPermitidos.includes(email)) {
      return showAlert("❌ Este correo no está autorizado para registrarse", "error");
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showAlert("✅ Registrado correctamente", "success");
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/vendedor");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showAlert("❌ El email ya está registrado", "error");
      } else {
        showAlert("❌ " + error.message, "error");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const emailGoogle = result.user.email;

      if (!vendedoresPermitidos.includes(emailGoogle)) {
        showAlert("❌ Este correo no está autorizado", "error");
        return;
      }

      navigate("/vendedor");
    } catch (error) {
      showAlert("❌ Error con Google: " + error.message, "error");
    }
  };

  return (
    <div className="container py-5">
      <h2>👤 Ingreso / Registro de Vendedor</h2>

      <input
        type="email"
        className="form-control my-2"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control my-2"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary" onClick={handleLogin}>
          Ingresar
        </button>
        <button className="btn btn-secondary" onClick={handleRegister}>
          Registrarse
        </button>
      </div>

      <hr />
      <button className="btn btn-danger mt-2" onClick={handleGoogleLogin}>
        Iniciar con Google 🚀
      </button>

      <button className="btn btn-outline-secondary mt-3" onClick={() => navigate("/")}>
        ⬅ Volver al inicio
      </button>
    </div>
  );
}

export default LoginVendedor;
