import React, { useState, useEffect } from "react";
import PedidoForm from "../components/PedidoForm";
import { db, auth } from "../firebase/firebase";
import PedidoTabla from "../components/PedidoTabla";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { format, startOfDay, endOfDay } from "date-fns";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function VendedorView() {
  const [usuario, setUsuario] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("modoOscuro") === "true";
  });
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [cantidadPedidos, setCantidadPedidos] = useState(0);
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

  const cargarCantidadPedidos = async (fecha) => {
    const inicio = Timestamp.fromDate(startOfDay(fecha));
    const fin = Timestamp.fromDate(endOfDay(fecha));
    const pedidosRef = collection(db, "pedidos");

    const q = query(
      pedidosRef,
      where("fecha", ">=", inicio),
      where("fecha", "<=", fin),
      where("vendedorEmail", "==", usuario?.email || "")
    );

    const querySnapshot = await getDocs(q);
    setCantidadPedidos(querySnapshot.docs.length);
  };

 useEffect(() => {
  if (usuario) {
    cargarCantidadPedidos(fechaSeleccionada);
    cargarPedidos(fechaSeleccionada);
  }
}, [fechaSeleccionada, usuario]);

  const agregarPedido = async (pedido) => {
    const fechaAhora = new Date();
    await addDoc(collection(db, "pedidos"), {
      ...pedido,
      vendedorEmail: usuario?.email || "sin usuario",
      fecha: Timestamp.fromDate(fechaAhora),
      fechaStr: format(fechaAhora, "dd/MM/yyyy HH:mm"),
    });
    cargarCantidadPedidos(fechaSeleccionada);
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

const [pedidos, setPedidos] = useState([]);

const cargarPedidos = async (fecha) => {
  const inicio = Timestamp.fromDate(startOfDay(fecha));
  const fin = Timestamp.fromDate(endOfDay(fecha));
  const pedidosRef = collection(db, "pedidos");

  const q = query(
    pedidosRef,
    where("fecha", ">=", inicio),
    where("fecha", "<=", fin),
    where("vendedorEmail", "==", usuario?.email || "")
  );

  const querySnapshot = await getDocs(q);
  setPedidos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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

        <div className="mb-4">
          <label className="me-2 fw-bold">📅 Ver cantidad de pedidos del día:</label>
          <DatePicker
            selected={fechaSeleccionada}
            onChange={(fecha) => setFechaSeleccionada(fecha)}
            className="form-control d-inline-block w-auto"
            dateFormat="dd/MM/yyyy"
          />
          <div className="mt-2">
            <strong>Pedidos cargados ese día:</strong> {cantidadPedidos}
          </div>
        </div>

        <PedidoForm onAgregar={agregarPedido} />
      </div>


      <hr className="my-4" />
<h4 className="mb-3">📋 Tus pedidos del día</h4>
<PedidoTabla pedidos={pedidos} mostrarVendedor={false} />
    </div>
  );
}

export default VendedorView;
