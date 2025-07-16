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
  doc,
  getDoc,
  deleteField  // 👉 agregalo acá
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

  const repartidores = [
    { label: "R1", email: "repartidor1@gmail.com" },
    { label: "R2", email: "repartidor2@gmail.com" },
    { label: "R3", email: "repartidor3@gmail.com" },
    { label: "R4", email: "repartidor4@gmail.com" },
  ];

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

  const handleAsignar = async (pedidoId, email, asignar) => {
  const pedidoRef = doc(db, "pedidos", pedidoId);
  const pedidoSnap = await getDoc(pedidoRef);
  const pedidoData = pedidoSnap.data();

  const actual = Array.isArray(pedidoData.asignadoA) ? pedidoData.asignadoA : [];
  const nuevo = asignar
    ? [...new Set([...actual, email])]
    : actual.filter(e => e !== email);

  await updateDoc(pedidoRef, { asignadoA: nuevo });

  // 🔍 Verificar si ya no tiene repartidores asignados
  if (nuevo.length === 0) {
    await updateDoc(pedidoRef, { ordenRuta: deleteField() });
  }

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
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>👤 Cliente</th>
              <th>📌 Dirección</th>
              <th>📝 Pedido</th>
              {repartidores.map((r) => (
                <th key={r.email} className="text-center">{r.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr
                key={p.id}
                className={p.asignadoA?.length > 0 ? "table-success" : ""}
              >
                <td><strong>{p.nombre}</strong></td>
                <td>{p.direccion}</td>
                <td style={{ whiteSpace: 'pre-wrap' }}>{p.pedido}</td>
                {repartidores.map((r) => (
                  <td key={r.email} className="text-center">
                    <input
                      type="checkbox"
                      checked={p.asignadoA?.includes(r.email) || false}
                      onChange={(e) => handleAsignar(p.id, r.email, e.target.checked)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/admin/pedidos")}>
        ⬅ Volver a pedidos
      </button>
    </div>
  );
}

export default AdminDivisionPedidos;
