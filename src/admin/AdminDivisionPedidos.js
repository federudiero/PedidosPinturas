// AdminDivisionPedidos.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  doc
} from "firebase/firestore";
import { startOfDay, endOfDay } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

function AdminDivisionPedidos() {
  const navigate = useNavigate();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
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
    if (!adminAuth) navigate("/admin");
    else cargarPedidosPorFecha(fechaSeleccionada);
  }, [fechaSeleccionada]);

  const handleAsignar = async (pedidoId, campo, valor) => {
    await updateDoc(doc(db, "pedidos", pedidoId), {
      [campo]: valor,
    });
    cargarPedidosPorFecha(fechaSeleccionada);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">🗂 División de Pedidos por Repartidor</h2>

      <div className="mb-3">
        <label className="form-label">📅 Seleccionar fecha:</label>
        <DatePicker
          selected={fechaSeleccionada}
          onChange={(date) => setFechaSeleccionada(date)}
          className="form-control"
        />
      </div>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Pedido</th>
              <th>R1</th>
              <th>R2</th>
              <th>R3</th>
              <th>R4</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.direccion}</td>
                <td>{p.pedido}</td>
                {[1, 2, 3, 4].map((n) => (
                  <td key={n}>
                    <input
                      type="checkbox"
                      checked={p[`repartidor${n}`] || false}
                      onChange={(e) => handleAsignar(p.id, `repartidor${n}`, e.target.checked)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/admin/pedidos")}>⬅ Volver a pedidos</button>
    </div>
  );
}

export default AdminDivisionPedidos;
