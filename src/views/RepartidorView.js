// src/views/RepartidorView.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection, getDocs, query, where, updateDoc, doc, Timestamp
} from "firebase/firestore";
import { startOfDay, endOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function RepartidorView() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  const cargarPedidos = async (fecha) => {
    const inicio = Timestamp.fromDate(startOfDay(fecha));
    const fin = Timestamp.fromDate(endOfDay(fecha));
    const q = query(
      collection(db, "pedidos"),
      where("fecha", ">=", inicio),
      where("fecha", "<=", fin)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPedidos(data);
  };

  useEffect(() => {
    const autorizado = localStorage.getItem("repartidorAutenticado");
    if (!autorizado) navigate("/login-repartidor");
    else cargarPedidos(fechaSeleccionada);
  }, [fechaSeleccionada]);

  const marcarEntregado = async (id, entregado) => {
    await updateDoc(doc(db, "pedidos", id), { entregado });
    setPedidos(prev =>
      prev.map(p => (p.id === id ? { ...p, entregado } : p))
    );
  };

  return (
    <div className="container py-4">
      <h2>🚚 Pedidos para Reparto</h2>

      <div className="mb-3">
        <DatePicker
          selected={fechaSeleccionada}
          onChange={(date) => setFechaSeleccionada(date)}
          className="form-control"
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Pedido</th>
            <th>Entregado</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.direccion}</td>
              <td>{p.telefono}</td>
              <td>{p.pedido}</td>
              <td>
                <input
                  type="checkbox"
                  checked={!!p.entregado}
                  onChange={(e) => marcarEntregado(p.id, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-outline-danger mt-3" onClick={() => {
        localStorage.removeItem("repartidorAutenticado");
        navigate("/login-repartidor");
      }}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default RepartidorView;
