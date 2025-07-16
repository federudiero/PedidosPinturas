// ListaRutaPasoAPaso.js
import React from "react";

const ListaRutaPasoAPaso = ({ pedidosOrdenados }) => {
  if (!pedidosOrdenados || pedidosOrdenados.length === 0) {
    return <p className="mt-3">📭 No hay pedidos para mostrar.</p>;
  }

  return (
    <div className="mt-4">
      <h4 className="mb-3">🧭 Lista paso a paso</h4>
      <div className="list-group">
        {pedidosOrdenados.map((p, i) => (
          <div
            key={p.id}
            className="list-group-item list-group-item-action d-flex flex-column gap-2"
          >
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">🚩 Parada #{p.ordenRuta}</h5>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  p.direccion
                )}`}
                className="btn btn-outline-primary btn-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ir con Google Maps
              </a>
            </div>

            <p className="mb-1">
              <strong>👤 Cliente:</strong> {p.nombre}
            </p>
            <p className="mb-1">
              <strong>📌 Dirección:</strong> {p.direccion}
            </p>
            <p className="mb-1">
              <strong>📱 Teléfono:</strong> {p.telefono}
            </p>
            <p className="mb-1">
              <strong>📝 Pedido:</strong> {p.pedido}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaRutaPasoAPaso;
