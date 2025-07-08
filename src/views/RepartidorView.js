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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaMapMarkerAlt } from "react-icons/fa";

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

  const actualizarMetodoPago = async (id, metodoPago) => {
    await updateDoc(doc(db, "pedidos", id), { metodoPago });
    setPedidos(prev =>
      prev.map(p => (p.id === id ? { ...p, metodoPago } : p))
    );
  };

  const actualizarComprobante = async (id, comprobante) => {
    await updateDoc(doc(db, "pedidos", id), { comprobante });
    setPedidos(prev =>
      prev.map(p => (p.id === id ? { ...p, comprobante } : p))
    );
  };

  const exportarEntregadosAExcel = () => {
    const entregados = pedidos.filter(p => p.entregado);
    const data = entregados.map(p => ({
      Nombre: p.nombre,
      Dirección: p.direccion,
      Teléfono: p.telefono,
      Pedido: p.pedido,
      Fecha: p.fechaStr || "",
      MétodoPago: p.metodoPago || "",
      Comprobante: p.comprobante || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entregados");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, `Entregados_${new Date().toLocaleDateString()}.xlsx`);
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
            <th>Pago</th>
            <th>Comprobante</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>
                {p.direccion}{" "}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.direccion)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ver en Google Maps"
                >
                  <FaMapMarkerAlt className="text-primary ms-2" />
                </a>
              </td>
              <td>{p.telefono}</td>
              <td>{p.pedido}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!p.entregado}
                    onChange={(e) => marcarEntregado(p.id, e.target.checked)}
                  />
                  <span className={p.entregado ? "text-success" : "text-danger"}>
                    {p.entregado ? "Entregado" : "No entregado"}
                  </span>
                </div>
              </td>
              <td>
                <select
                  className="form-select"
                  value={p.metodoPago || ""}
                  onChange={(e) => actualizarMetodoPago(p.id, e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </td>
              <td>
                {(p.metodoPago === "tarjeta" || p.metodoPago === "transferencia") && (
  <input
    className="form-control"
    placeholder="N° comprobante"
    value={p.comprobante || ""}
    onChange={(e) => actualizarComprobante(p.id, e.target.value)}
  />
)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3">
        <strong>✅ Entregados:</strong> {pedidos.filter(p => p.entregado).length} / {pedidos.length}
      </div>

      <div className="mt-3">
        <strong>💰 Total recaudado (entregados):</strong>{" "}
        ${pedidos
          .filter(p => p.entregado)
          .reduce((sum, p) => {
            const match = typeof p.pedido === "string" ? p.pedido.match(/TOTAL: \$?(\d+)/) : null;
            let total = match ? parseInt(match[1]) : 0;
            if (p.metodoPago === "transferencia" || p.metodoPago === "tarjeta") {
              total *= 1.1;
            }
            return sum + total;
          }, 0).toLocaleString()}
      </div>

      <button className="btn btn-success mt-3" onClick={exportarEntregadosAExcel}>
        📥 Exportar entregados a Excel
      </button>

      <button className="btn btn-outline-danger mt-3 ms-2" onClick={() => {
        localStorage.removeItem("repartidorAutenticado");
        navigate("/login-repartidor");
      }}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default RepartidorView;
