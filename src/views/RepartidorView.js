// RepartidorView.js actualizado y funcional con lista ordenada
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
import RutaOptimizada from "../components/RutaOptimizada";
import ListaRutaPasoAPaso from "../components/ListaRutaPasoAPaso";
import BotonIniciarViaje from "../components/BotonIniciarViaje";





function RepartidorView() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [filtroEntrega, setFiltroEntrega] = useState("todos");
  const [pedidos, setPedidos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [gastoExtra, setGastoExtra] = useState(0);
  const [campoAsignacion, setCampoAsignacion] = useState("");
  const [pedidosOrdenados, setPedidosOrdenados] = useState([]);

 const cargarPedidos = async (fecha, email) => {
  const inicio = Timestamp.fromDate(startOfDay(fecha));
  const fin = Timestamp.fromDate(endOfDay(fecha));
  const q = query(
    collection(db, "pedidos"),
    where("fecha", ">=", inicio),
    where("fecha", "<=", fin),
    where("asignadoA", "array-contains", email)
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

  setCampoAsignacion(email); // solo para enviar a RutaOptimizada
  cargarPedidos(fechaSeleccionada, email);
}, [fechaSeleccionada]);


  const marcarEntregado = async (id, entregado) => {
  await updateDoc(doc(db, "pedidos", id), { entregado });
  setPedidos(prev => prev.map(p => (p.id === id ? { ...p, entregado } : p)));
  setPedidosOrdenados(prev => prev.map(p => (p.id === id ? { ...p, entregado } : p)));
};

  const actualizarMetodoPago = async (id, metodoPago) => {
  await updateDoc(doc(db, "pedidos", id), { metodoPago });

  // Actualizar ambos estados
  setPedidos(prev => prev.map(p => (p.id === id ? { ...p, metodoPago } : p)));
  setPedidosOrdenados(prev => prev.map(p => (p.id === id ? { ...p, metodoPago } : p)));
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
      if (p.metodoPago === "transferencia") monto *= 1.1;
      else if (p.metodoPago === "tarjeta") monto *= 1.1;
      if (p.metodoPago === "transferencia") totalTransferencia += monto;
      else if (p.metodoPago === "tarjeta") totalTarjeta += monto;
      else if (p.metodoPago === "efectivo") totalEfectivo += monto;
    });

    const totalFinal = totalEfectivo + totalTransferencia + totalTarjeta - gastoExtra;
    return { totalEfectivo, totalTransferencia, totalTarjeta, totalFinal };
  }, [pedidos, gastoExtra]);

  const exportarEntregadosAExcel = () => {
    const entregados = [...pedidos]
      .filter(p => p.entregado)
      .sort((a, b) => (a.ordenRuta || 9999) - (b.ordenRuta || 9999));

    const data = entregados.map(p => {
      const match = typeof p.pedido === "string" ? p.pedido.match(/TOTAL: \$?(\d+)/) : null;
      let monto = match ? parseInt(match[1]) : 0;
      if (p.metodoPago === "transferencia" || p.metodoPago === "tarjeta") monto *= 1.1;

      return {
        Orden: p.ordenRuta,
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
   <div className={`container py-4 ${darkMode ? "bg-dark text-white" : ""}`} style={{ minHeight: "100vh" }}>

      <h2>🚚 Pedidos para Reparto</h2>

      <div className="mb-3">
        <DatePicker selected={fechaSeleccionada} onChange={(date) => setFechaSeleccionada(date)} className="form-control" />
      </div>

<div className="form-check form-switch mb-3">
  <input
    className="form-check-input"
    type="checkbox"
    id="modoOscuro"
    checked={darkMode}
    onChange={() => setDarkMode(!darkMode)}
  />
  <label className="form-check-label ms-2" htmlFor="modoOscuro">
    🌙 Activar modo oscuro
  </label>
</div>

   <div className="mt-5">
  <h4>📋 Control de Entregas</h4>
  <div className="row g-3">
    {pedidosOrdenados.map((p, i) => (
      <div className="col-12 col-md-6 col-lg-4" key={p.id}>
       <div className={`card h-100 shadow-sm ${darkMode ? "bg-secondary text-white" : ""}`}>
          <div className={`card-header d-flex justify-content-between ${darkMode ? "bg-dark text-white" : "bg-primary text-white"}`}>
            <span>📦 Pedido #{p.ordenRuta || i + 1}</span>
            {p.entregado && <span className="badge bg-success">Entregado</span>}
          </div>
          <div className="card-body">
            <p><strong>👤 Cliente:</strong> {p.nombre}</p>
            <p><strong>📌 Dirección:</strong> {p.direccion}{" "}
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.direccion)}`} target="_blank" rel="noopener noreferrer">
                <FaMapMarkerAlt className="text-danger ms-1" />
              </a>
            </p>
            <p><strong>📱 Teléfono:</strong> {p.telefono}</p>
       <p>
  <strong>📝 Pedido:</strong><br />
  <span className={darkMode ? "text-light" : "text-dark"}>{p.pedido}</span>
</p>
<button
  className={`btn w-100 fw-bold shadow-sm ${p.entregado ? "btn-success" : "btn-danger"}`}
  onClick={() => marcarEntregado(p.id, !p.entregado)}
>
  {p.entregado ? "✅ Entregado" : "🚫 No entregado"}
</button>

            <label><strong>💰 Método de pago</strong></label>
            <select className="form-select shadow-sm rounded-3 mb-2" value={p.metodoPago || ""} onChange={(e) => actualizarMetodoPago(p.id, e.target.value)}>
              <option value="">Seleccionar</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
            </select>

            {(p.metodoPago === "transferencia" || p.metodoPago === "tarjeta") && (
              <input
                className="form-control shadow-sm rounded-3"
                placeholder="N° comprobante"
                value={p.comprobante || ""}
                onChange={(e) => actualizarComprobante(p.id, e.target.value)}
              />
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
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

      <div className="mt-4">
        <label><strong>⛽ Gasto extra (combustible, etc):</strong></label>
        <input type="number" className="form-control w-auto" value={gastoExtra} onChange={(e) => actualizarGastoExtra(e.target.value)} />
      </div>

      <div className="mt-5">
        <h4>🗺️ Ruta Optimizada</h4>
        
        <RutaOptimizada fecha={fechaSeleccionada} repartidorCampo={campoAsignacion} setListaOrdenada={setPedidosOrdenados} />
      </div>

     <ListaRutaPasoAPaso pedidosOrdenados={pedidosOrdenados} />

<BotonIniciarViaje pedidos={pedidosOrdenados} />


      <button className="btn btn-success mt-4" onClick={exportarEntregadosAExcel}>
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
