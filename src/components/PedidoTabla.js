import React from "react";

const PedidoTabla = ({ pedidos, onEditar, onEliminar }) => {
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
          <th>⚙️ Acciones</th>
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
            <td>
              <button className="btn btn-sm btn-warning me-2" onClick={() => onEditar(p)}>Editar</button>
              <button className="btn btn-sm btn-danger" onClick={() => onEliminar(p.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PedidoTabla;