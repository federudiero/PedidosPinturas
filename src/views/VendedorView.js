import React, { useState, useEffect } from "react";
import PedidoForm from "../components/PedidoForm";
import { db } from "../firebase/firebase";
import { collection, addDoc, Timestamp, getDocs, query, where } from "firebase/firestore";
import { startOfDay, endOfDay, format } from "date-fns";
import { useNavigate } from "react-router-dom";

function VendedorView() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const navigate = useNavigate();

  const agregarPedido = async (pedido) => {
    try {
      const fechaAhora = new Date();
      await addDoc(collection(db, "pedidos"), {
        ...pedido,
        fecha: Timestamp.fromDate(fechaAhora),
        fechaStr: format(fechaAhora, "dd/MM/yyyy HH:mm")
      });
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Sistema de Pedidos - Pinturería</h2>
      <PedidoForm onAgregar={agregarPedido} />

      <button className="btn btn-outline-dark mt-4" onClick={() => navigate("/admin")}>
        Ir al panel de administrador
      </button>
    </div>
  );
}

export default VendedorView;
