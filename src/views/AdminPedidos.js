import React, { useEffect, useState } from "react";
import PedidoTabla from "../components/PedidoTabla";
import ExportarExcel from "../components/ExportarExcel";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { startOfDay, endOfDay } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import EditarPedidoModal from "../components/EditarPedidoModal";

function AdminPedidos() {
  const navigate = useNavigate();
  const fechaGuardada = localStorage.getItem("fechaSeleccionadaAdmin");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    fechaGuardada ? new Date(fechaGuardada) : new Date()
  );
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("modoOscuro") === "true";
  });

  const [modalVisible, setModalVisible] = useState(false);
const [pedidoAEditar, setPedidoAEditar] = useState(null);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const nuevoModo = !prev;
      localStorage.setItem("modoOscuro", nuevoModo);
      return nuevoModo;
    });
  };

 const cargarPedidosPorFecha = async (fecha) => {
  setLoading(true);

  const start = new Date(fecha);
  start.setHours(0, 0, 0, 0);

  const end = new Date(fecha);
  end.setHours(23, 59, 59, 999);

  const inicio = Timestamp.fromDate(start);
  const fin = Timestamp.fromDate(end);

  const pedidosRef = collection(db, "pedidos");
  const q = query(pedidosRef, where("fecha", ">=", inicio), where("fecha", "<=", fin));
  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs.map(docSnap => ({
    ...docSnap.data(),
    id: docSnap.id
  }));

  console.log("Pedidos cargados:", data);

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
  }, [fechaSeleccionada, navigate]);

  const handleFechaChange = (date) => {
    setFechaSeleccionada(date);
    localStorage.setItem("fechaSeleccionadaAdmin", date);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("adminAutenticado");
    localStorage.removeItem("fechaSeleccionadaAdmin");
    navigate("/");
  };

  const eliminarPedido = async (id) => {
    if (window.confirm("¿Seguro que querés eliminar este pedido?")) {
      try {
        await deleteDoc(doc(db, "pedidos", id));
        cargarPedidosPorFecha(fechaSeleccionada);
      } catch (error) {
        alert("❌ Error al eliminar: " + error.message);
      }
    }
  };

const editarPedido = (pedido) => {
  setPedidoAEditar(pedido);
  setModalVisible(true);
};

const guardarCambios = async (pedidoEditado) => {
  try {
    const { id, ...resto } = pedidoEditado;
    await updateDoc(doc(db, "pedidos", id), resto);
    setModalVisible(false);
    cargarPedidosPorFecha(fechaSeleccionada);
  } catch (error) {
    alert("❌ Error al guardar cambios: " + error.message);
  }
};

  return (
    <div className={darkMode ? "bg-dark text-light min-vh-100" : "bg-light text-dark min-vh-100"}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">📋 Pedidos del Día - Administrador</h2>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={toggleDarkMode}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button className="btn btn-outline-danger" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
            <button className="btn btn-outline-info" onClick={() => navigate("/admin/dividir-pedidos")}>
              🗂 División de Pedidos
            </button>
            <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
              ⬅ Volver a zona de pedidos
            </button>
          </div>
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
            <PedidoTabla pedidos={pedidos} onEditar={editarPedido} onEliminar={eliminarPedido} />
            <ExportarExcel pedidos={pedidos} />
          </>
        ) : (
          <p className="text-muted mt-4">No hay pedidos para esta fecha.</p>
        )}
      </div>

      <EditarPedidoModal
  show={modalVisible}
  onClose={() => setModalVisible(false)}
  pedido={pedidoAEditar}
  onGuardar={guardarCambios}
/>
    </div>
  );
}

export default AdminPedidos;
