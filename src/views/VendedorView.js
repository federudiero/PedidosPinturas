import React, { useState, useEffect } from "react";
import PedidoForm from "../components/PedidoForm";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

function VendedorView() {
  const [usuario, setUsuario] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("modoOscuro") === "true";
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login-vendedor");
      } else {
        setUsuario(user);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const agregarPedido = async (pedido) => {
    const fechaAhora = new Date();
    await addDoc(collection(db, "pedidos"), {
      ...pedido,
      vendedorEmail: usuario?.email || "sin usuario",
      fecha: Timestamp.fromDate(fechaAhora),
      fechaStr: format(fechaAhora, "dd/MM/yyyy HH:mm"),
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login-vendedor");
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const nuevoModo = !prev;
      localStorage.setItem("modoOscuro", nuevoModo);
      return nuevoModo;
    });
  };

  return (
    <div className={darkMode ? "bg-dark text-light min-vh-100" : "bg-light text-dark min-vh-100"}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Sistema de Pedidos - Pinturería</h2>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={toggleDarkMode}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>

        <PedidoForm onAgregar={agregarPedido} />
      </div>
    </div>
  );
}

export default VendedorView;
