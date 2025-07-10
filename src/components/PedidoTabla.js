import React from "react";

const PedidoTabla = ({ pedidos, onEditar, onEliminar }) => {
  return (
    <div className="container">
      {pedidos.length === 0 ? (
        <p className="text-center mt-4">No hay pedidos cargados.</p>
      ) : (
        <div className="row">
          {pedidos.map((p, i) => (
            <div key={i} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">📦 Pedido #{i + 1}</h5>
                  <p><strong>👤 Nombre:</strong> {p.nombre}</p>
                  <p><strong>📌 Dirección:</strong> {p.direccion}</p>
                  <p><strong>🌐 Entre calles:</strong> {p.entreCalles}</p>
                  <p><strong>📍 Partido:</strong> {p.partido}</p>
                  <p><strong>📱 Teléfono:</strong> {p.telefono}</p>
                  <p><strong>📝 Pedido:</strong> {p.pedido}</p>
                </div>
                <div className="card-footer text-end">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => onEditar?.(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onEliminar?.(p.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidoTabla;