// RepartidorView.js actualizado y mejorado visualmente
import React, { useEffect, useState, useMemo } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  Timestamp,
  setDoc,
  getDoc
} from "firebase/firestore";
import { startOfDay, endOfDay, format } from "date-fns";
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
  const [gastoExtra, setGastoExtra] = useState(0);
  const [campoAsignacion, setCampoAsignacion] = useState("");

  const cargarPedidos = async (fecha, campo) => {
    const inicio = Timestamp.fromDate(startOfDay(fecha));
    const fin = Timestamp.fromDate(endOfDay(fecha));

    const q = query(
      collection(db, "pedidos"),
      where("fecha", ">=", inicio),
      where("fecha", "<=", fin),
      where(campo, "==", true)
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPedidos(data);

    const fechaId = format(fecha, 'yyyy-MM-dd');
    const gastoDoc = await getDoc(doc(db, "gastosReparto", fechaId));
    setGastoExtra(gastoDoc.exists() ? gastoDoc.data().monto || 0 : 0);
  };

  useEffect(() => {
    const autorizado = localStorage.getItem("repartidorAutenticado");
    const email = localStorage.getItem("emailRepartidor");

    if (!autorizado || !email) return navigate("/login-repartidor");

    let campo = "";
    if (email === "repartidor1@gmail.com") campo = "repartidor1";
    else if (email === "repartidor2@gmail.com") campo = "repartidor2";
    else if (email === "repartidor3@gmail.com") campo = "repartidor3";
    else if (email === "repartidor4@gmail.com") campo = "repartidor4";

    setCampoAsignacion(campo);
    cargarPedidos(fechaSeleccionada, campo);
  }, [fechaSeleccionada]);

  const marcarEntregado = async (id, entregado) => {
    await updateDoc(doc(db, "pedidos", id), { entregado });
    setPedidos(prev => prev.map(p => (p.id === id ? { ...p, entregado } : p)));
  };

  const actualizarMetodoPago = async (id, metodoPago) => {
    await updateDoc(doc(db, "pedidos", id), { metodoPago });
    setPedidos(prev => prev.map(p => (p.id === id ? { ...p, metodoPago } : p)));
  };

  const actualizarComprobante = async (id, comprobante) => {
    await updateDoc(doc(db, "pedidos", id), { comprobante });
    setPedidos(prev => prev.map(p => (p.id === id ? { ...p, comprobante } : p)));
  };

  const actualizarGastoExtra = async (valor) => {
    const num = parseInt(valor) || 0;
    setGastoExtra(num);
    const fechaId = format(fechaSeleccionada, 'yyyy-MM-dd');
    await setDoc(doc(db, "gastosReparto", fechaId), { monto: num });
  };

  const totales = useMemo(() => {
    let totalEfectivo = 0;
    let totalTransferencia = 0;
    let totalTarjeta = 0;

    pedidos.forEach(p => {
      if (!p.entregado || typeof p.pedido !== "string") return;
      const match = p.pedido.match(/TOTAL: \$?(\d+)/);
      let monto = match ? parseInt(match[1]) : 0;

      if (p.metodoPago === "transferencia") {
        monto *= 1.1;
        totalTransferencia += monto;
      } else if (p.metodoPago === "tarjeta") {
        monto *= 1.1;
        totalTarjeta += monto;
      } else if (p.metodoPago === "efectivo") {
        totalEfectivo += monto;
      }
    });

    const totalFinal = totalEfectivo + totalTransferencia + totalTarjeta - gastoExtra;

    return { totalEfectivo, totalTransferencia, totalTarjeta, totalFinal };
  }, [pedidos, gastoExtra]);

  const exportarEntregadosAExcel = () => {
    const entregados = pedidos.filter(p => p.entregado);
    const data = entregados.map(p => {
      const match = typeof p.pedido === "string" ? p.pedido.match(/TOTAL: \$?(\d+)/) : null;
      let monto = match ? parseInt(match[1]) : 0;

      if (p.metodoPago === "transferencia" || p.metodoPago === "tarjeta") {
        monto *= 1.1;
      }

      return {
        Nombre: p.nombre,
        Dirección: p.direccion,
        Teléfono: p.telefono,
        Pedido: p.pedido,
        Fecha: p.fechaStr || "",
        MétodoPago: p.metodoPago || "",
        Comprobante: p.comprobante || "",
        MontoCalculado: `$${monto.toLocaleString()}`
      };
    });

    data.push({},
      { Nombre: "💵 Total Efectivo", MontoCalculado: `$${totales.totalEfectivo.toLocaleString()}` },
      { Nombre: "🏦 Total Transferencia (+10%)", MontoCalculado: `$${totales.totalTransferencia.toLocaleString()}` },
      { Nombre: "💳 Total Tarjeta (+10%)", MontoCalculado: `$${totales.totalTarjeta.toLocaleString()}` },
      { Nombre: "⛽ Gasto Extra", MontoCalculado: `-$${gastoExtra.toLocaleString()}` },
      { Nombre: "💰 Total Neto Recaudado", MontoCalculado: `$${totales.totalFinal.toLocaleString()}` }
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entregados");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Entregados_${format(fechaSeleccionada, 'yyyy-MM-dd')}.xlsx`);
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

      <div className="row">
        {pedidos.map((p, i) => (
          <div className="col-md-6 col-lg-4 mb-4" key={p.id}>
            <div className="card shadow-sm h-100">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <span>📦 Pedido #{i + 1}</span>
                {p.entregado && <span className="badge bg-success">Entregado</span>}
              </div>
              <div className="card-body">
                <p className="mb-2"><strong>👤 Cliente:</strong> {p.nombre}</p>
                <hr className="my-2" />
                <p className="mb-2">
                  <strong>📌 Dirección:</strong> {p.direccion}{" "}
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.direccion)}`} target="_blank" rel="noopener noreferrer">
                    <FaMapMarkerAlt className="text-danger ms-1" />
                  </a>
                </p>
                <p className="mb-2"><strong>📱 Teléfono:</strong> {p.telefono}</p>
                <hr className="my-2" />
                <p className="mb-2"><strong>📝 Pedido:</strong><br /><span className="text-dark">{p.pedido}</span></p>

                <div className="form-check form-switch my-2">
                  <input type="checkbox" className="form-check-input" id={`entregado-${p.id}`} checked={!!p.entregado} onChange={(e) => marcarEntregado(p.id, e.target.checked)} />
                  <label className="form-check-label ms-2" htmlFor={`entregado-${p.id}`}>✅ Marcar como entregado</label>
                </div>

                <label><strong>💰 Método de pago</strong></label>
                <select className="form-select shadow-sm rounded-3 mb-2" value={p.metodoPago || ""} onChange={(e) => actualizarMetodoPago(p.id, e.target.value)}>
                  <option value="">Seleccionar</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>

                {(p.metodoPago === "transferencia" || p.metodoPago === "tarjeta") && (
                  <input className="form-control shadow-sm rounded-3" placeholder="N° comprobante" value={p.comprobante || ""} onChange={(e) => actualizarComprobante(p.id, e.target.value)} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label><strong>⛽ Gasto extra (combustible, etc):</strong></label>
        <input type="number" className="form-control w-auto" value={gastoExtra} onChange={(e) => actualizarGastoExtra(e.target.value)} />
      </div>

      <div className="alert alert-secondary mt-4">
        <p className="mb-1"><strong>✅ Entregados:</strong> {pedidos.filter(p => p.entregado).length} / {pedidos.length}</p>
        <p className="mb-1"><strong>💵 Total efectivo:</strong> ${totales.totalEfectivo.toLocaleString()}</p>
        <p className="mb-1"><strong>🏦 Total transferencia (+10%):</strong> ${totales.totalTransferencia.toLocaleString()}</p>
        <p className="mb-1"><strong>💳 Total tarjeta (+10%):</strong> ${totales.totalTarjeta.toLocaleString()}</p>
        <p className="mb-1"><strong>⛽ Gasto extra:</strong> -${gastoExtra.toLocaleString()}</p>
        <hr />
        <h5><strong>💰 Total recaudado neto:</strong> ${totales.totalFinal.toLocaleString()}</h5>
      </div>

      <button className="btn btn-success mt-3" onClick={exportarEntregadosAExcel}>
        📥 Exportar entregados a Excel
      </button>

      <button className="btn btn-outline-danger mt-3 ms-2" onClick={() => {
        localStorage.removeItem("repartidorAutenticado");
        localStorage.removeItem("emailRepartidor");
        navigate("/login-repartidor");
      }}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default RepartidorView;