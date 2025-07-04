import React from "react";

const PedidoTabla = ({ pedidos }) => {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>👤 Nombre</th>
          <th>📌 Dirección</th>
          <th>🌐 Entre calles</th>
          <th>📍 Partido</th>
          <th>📱 Teléfono</th>
          <th>📝 Pedido</th>
        </tr>
      </thead>
      <tbody>
        {pedidos.map((p, i) => (
          <tr key={i}>
            <td>{p.nombre}</td>
            <td>{p.direccion}</td>
            <td>{p.entreCalles}</td>
            <td>{p.partido}</td>
            <td>{p.telefono}</td>
            <td>{p.pedido}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PedidoTabla;
