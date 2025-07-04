import React, { useEffect, useState } from "react";
import PedidoTabla from "../components/PedidoTabla";
import ExportarExcel from "../components/ExportarExcel";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { startOfDay, endOfDay } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

;

function AdminPedidos() {
  const navigate = useNavigate();
  const fechaGuardada = localStorage.getItem("fechaSeleccionadaAdmin");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    fechaGuardada ? new Date(fechaGuardada) : new Date()
  );
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarPedidosPorFecha = async (fecha) => {
    setLoading(true);
    const inicio = Timestamp.fromDate(startOfDay(fecha));
    const fin = Timestamp.fromDate(endOfDay(fecha));
    const pedidosRef = collection(db, "pedidos");
    const q = query(pedidosRef, where("fecha", ">=", inicio), where("fecha", "<=", fin));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPedidos(data);
    setLoading(false);
  };

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAutenticado");
    if (!adminAuth) {
      navigate("/admin");
    } else {
      cargarPedidosPorFecha(fechaSeleccionada);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaSeleccionada]);

  const handleFechaChange = (date) => {
    setFechaSeleccionada(date);
    localStorage.setItem("fechaSeleccionadaAdmin", date);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("adminAutenticado");
    localStorage.removeItem("fechaSeleccionadaAdmin");
    navigate("/admin");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">📋 Pedidos del Día - Administrador</h2>
        <button className="btn btn-outline-danger" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      
  <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
    ⬅ Volver a zona de pedidos
  </button>

      </div>

      <div className="mb-4">
        <label>📅 Seleccionar fecha:</label>
        <DatePicker
          selected={fechaSeleccionada}
          onChange={handleFechaChange}
          className="form-control"
        />
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando pedidos...</p>
        </div>
      ) : pedidos.length > 0 ? (
        <>
          <PedidoTabla pedidos={pedidos} />
          <ExportarExcel pedidos={pedidos} />
        </>
      ) : (
        <p className="text-muted mt-4">No hay pedidos para esta fecha.</p>
      )}
    </div>
  );
}

export default AdminPedidos;
