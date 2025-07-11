import React from "react";
import Swal from "sweetalert2";

const PedidoTabla = ({ pedidos, onEditar, onEliminar }) => {
  const copiarPedidoCompleto = (pedido) => {
    const textoCompleto = `
👤 Nombre: ${pedido.nombre}
📌 Dirección: ${pedido.direccion}
🌐 Entre calles: ${pedido.entreCalles}
📍 Partido: ${pedido.partido}
📱 Teléfono: ${pedido.telefono}
📝 Pedido: ${pedido.pedido}
`.trim();

    navigator.clipboard.writeText(textoCompleto).then(() => {
      Swal.fire("✅ Copiado", "El pedido completo fue copiado al portapapeles.", "success");
    });
  };

  return (
    <div className="container">
      {pedidos.length === 0 ? (
        <p className="text-center mt-4">No hay pedidos cargados.</p>
      ) : (
        <div className="row">
          {pedidos.map((p, i) => (
            <div key={i} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100 border-start border-5 border-primary bg-light">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="text-primary mb-0 fw-bold">📦 Pedido #{i + 1}</h6>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      title="Copiar todo el pedido"
                      onClick={() => copiarPedidoCompleto(p)}
                    >
                      📋
                    </button>
                  </div>

                  <ul className="list-unstyled mb-3">
                    <li><strong>👤</strong> <strong>Nombre:</strong> {p.nombre}</li>
                    <li><strong>📌</strong> <strong>Direccion:</strong> {p.direccion}</li>
                    <li><strong>🌐</strong> <strong>Observación (Entre calles):</strong> {p.entreCalles}</li>
                    <li><strong>📍</strong> <strong> Ciudad o partido:</strong> {p.partido}</li>
                    <li><strong>📱</strong> <strong>Teléfono:</strong>{p.telefono}</li>
                  <li>
  <strong>📝 Pedido:</strong>
  <br />
  {(() => {
    const [detalle, total] = (p.pedido || "").split(" | TOTAL: $");
    return (
      <>
        <span style={{ whiteSpace: 'pre-wrap' }}>{detalle}</span>
        {total && (
          <p className="fw-bold text-success mb-0">TOTAL: ${total}</p>
        )}
      </>
    );
  })()}
</li>
                  </ul>
                </div>

                <div className="card-footer d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => onEditar?.(p)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onEliminar?.(p.id)}
                  >
                    🗑️ Eliminar
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
