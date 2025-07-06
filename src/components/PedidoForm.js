import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import Swal from "sweetalert2";

const productosCatalogo = [
  { nombre: "LÁTEX BLANCO 20L Económico", precio: 24700 },
  { nombre: "LÁTEX BLANCO 20L Premium", precio: 36500 },
  { nombre: "LÁTEX BLANCO 20L Lavable", precio: 39500 },
  { nombre: "LÁTEX BLANCO 20L Superior", precio: 43000 },

  { nombre: "Combo latex Económico + rodillo + enduido 20L ", precio: 28000 },
  { nombre: "Combo latex Económico + rodillo + enduido + fijador 20L ", precio: 29500 },
  { nombre: "Combo latex Premium + rodillo + enduido 20L ", precio: 39500 },
  { nombre: "Combo latex Lavable + rodillo + enduido 20L ", precio: 43500 },
  { nombre: "Combo latex Superior + rodillo + enduido 20L ", precio: 47000 },

  { nombre: "Enduido x Xl ", precio: 3000 },
  { nombre: "Enduido x 4lts ", precio: 10000 },
  { nombre: "Enduido x 10lts ", precio: 21000 },
  { nombre: "Enduido x 20lts ", precio: 42500 },

  { nombre: "Fijador x Xl ", precio: 3000 },
  { nombre: "Fijador x 4lts ", precio: 10000 },
  { nombre: "Fijador x 10lts ", precio: 21000 },
  { nombre: "Fijador x 20lts ", precio: 42500 },
  
   { nombre: "Membrana líquida", precio: 33500 },
   { nombre: "Membrana pasta", precio: 39500 },
   { nombre: "Membrana Roja/Gris", precio: 42500 },
  { nombre: "Membrana líquida 20L + rodillo + venda", precio: 37500 },
  { nombre: "Membrana pasta 20L + rodillo + venda", precio: 43500 },
  { nombre: "Membrana Rojo teja/gris 20L + rodillo + venda", precio: 46500 },

  { nombre: "Rodillo Semi lana 22 cm", precio: 3300 },

  { nombre: "LÁTEX COLOR Naranja 4L", precio: 21000 },
  { nombre: "LÁTEX COLOR Naranja 10L", precio: 33000 },
  { nombre: "LÁTEX COLOR Naranja 20L", precio: 55000 },

  { nombre: "LÁTEX COLOR Rosa 4L", precio: 21000 },
  { nombre: "LÁTEX COLOR Rosa 10L", precio: 33000 },
  { nombre: "LÁTEX COLOR Rosa 20L", precio: 55000 },

  { nombre: "LÁTEX COLOR Rojo 4L", precio: 21000 },
  { nombre: "LÁTEX COLOR Rojo 10L", precio: 33000 },
  { nombre: "LÁTEX COLOR Rojo 20L", precio: 55000 },

  { nombre: "LÁTEX COLOR Rojo teja 4L", precio: 21000 },
  { nombre: "LÁTEX COLOR Rojo teja 10L", precio: 33000 },
  { nombre: "LÁTEX COLOR Rojo teja 20L", precio: 55000 },

  { nombre: "LÁTEX COLOR Ocre  4L", precio: 21000 },
  { nombre: "LÁTEX COLOR Ocre  10L", precio: 33000 },
  { nombre: "LÁTEX COLOR Ocre  20L", precio: 55000 },


  { nombre: "LÁTEX COLOR Avena  4L", precio: 21000 },
  { nombre: "LÁTEX COLOR Avena  10L", precio: 33000 },
  { nombre: "LÁTEX COLOR Avena  20L", precio: 55000 },

  { nombre: "LÁTEX COLOR Amarillo  4L", precio: 21000 },
  { nombre: "LÁTEX COLOR Amarillo  10L", precio: 33000 },
  { nombre: "LÁTEX COLOR Amarillo  20L", precio: 55000 },

  { nombre: "LÁTEX COLOR Verde Manzana  4L", precio: 21000 },
  { nombre: "LÁTEX COLOR Verde Manzana  10L", precio: 33000 },
  { nombre: "LÁTEX COLOR Verde Manzana  20L", precio: 55000 },

  { nombre: "LÁTEX COLOR Verde Esmeralda  4L", precio: 21000 },
  { nombre: "LÁTEX COLOR Verde Esmeralda  10L", precio: 33000 },
  { nombre: "LÁTEX COLOR Verde Esmeralda  20L", precio: 55000 },

  { nombre: "LÁTEX COLOR Turquesa 4L", precio: 21000 },
  { nombre: "LÁTEX COLOR Turquesa  10L", precio: 33000 },
  { nombre: "LÁTEX COLOR Turquesa  20L", precio: 55000 },

  { nombre: "LÁTEX COLOR Gris  4L", precio: 21000 },
  { nombre: "LÁTEX COLOR Gris  10L", precio: 33000 },
  { nombre: "LÁTEX COLOR Gris  20L", precio: 55000 },

  { nombre: "LÁTEX COLOR Negro  4L", precio: 21000 },
  { nombre: "LÁTEX COLOR Negro  10L", precio: 33000 },
  { nombre: "LÁTEX COLOR Negro  20L", precio: 55000 },


  { nombre: "Envio1", precio: 4500 },
  { nombre: "Envio2", precio: 5000 },
  { nombre: "Envio3", precio: 5500 },


];

const PedidoForm = ({ onAgregar }) => {
  const { handleSubmit, reset, setValue } = useForm();
  const autoCompleteRef = useRef(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [partido, setPartido] = useState("");

  const [errorNombre, setErrorNombre] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });

  const handlePlaceChanged = () => {
    const place = autoCompleteRef.current.getPlace();
    const direccionCompleta = place.formatted_address || "";
    const plusCode = place.plus_code?.global_code || "";

    const direccionFinal = plusCode
      ? `${plusCode} - ${direccionCompleta}`
      : direccionCompleta;

    setValue("direccion", direccionFinal);
  };

  const toggleProducto = (producto) => {
    const yaSeleccionado = productosSeleccionados.find(p => p.nombre === producto.nombre);
    if (yaSeleccionado) {
      setProductosSeleccionados(prev => prev.filter(p => p.nombre !== producto.nombre));
    } else {
      setProductosSeleccionados(prev => [...prev, producto]);
    }
  };

  const calcularResumenPedido = () => {
    const resumen = productosSeleccionados.map(p => `${p.nombre} ($${p.precio})`).join(" - ");
    const total = productosSeleccionados.reduce((sum, p) => sum + p.precio, 0);
    return { resumen, total };
  };

  const onSubmit = (data) => {
    if (errorNombre || errorTelefono) {
      return Swal.fire("❌ Corregí los errores antes de enviar el pedido.");
    }

    const { resumen, total } = calcularResumenPedido();
    const pedidoFinal = `${resumen} | TOTAL: $${total}`;

    const pedidoConProductos = {
      ...data,
      nombre,
      telefono,
      partido,
      pedido: pedidoFinal
    };

    onAgregar(pedidoConProductos);
    setProductosSeleccionados([]);
    reset();
    setNombre("");
    setTelefono("");
    setPartido("");
  };

  return isLoaded ? (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-5">
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">🧑 Datos del cliente</h5>

            <label>👤 Nombre</label>
            <input
              className="form-control mb-1"
              value={nombre}
              onChange={(e) => {
                const val = e.target.value;
                setNombre(val);
                if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
                  setErrorNombre("❌ Solo letras y espacios.");
                } else {
                  setErrorNombre("");
                }
              }}
            />
            {errorNombre && <small className="text-danger">{errorNombre}</small>}

            <label className="mt-3">🏠 Calle y Altura</label>
            <Autocomplete
              onLoad={(autocomplete) => (autoCompleteRef.current = autocomplete)}
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                className="form-control mb-3"
                {...setValue("direccion", "")}
                placeholder="Buscar dirección"
              />
            </Autocomplete>

            <label>🗒️ Observación (Entre calles)</label>
            <input {...setValue("entreCalles", "")} className="form-control mb-3" />

            <label>🌆 Ciudad</label>
            <input
              className="form-control mb-3"
              value={partido}
              onChange={(e) => setPartido(e.target.value)}
              placeholder="Ciudad o localidad"
            />

            <label className="mt-3">📞 Teléfono</label>
            <input
              className="form-control mb-1"
              value={telefono}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setTelefono(val);
                if (!/^[0-9]{6,15}$/.test(val)) {
                  setErrorTelefono("❌ Solo números (6 a 15 dígitos).");
                } else {
                  setErrorTelefono("");
                }
              }}
            />
            {errorTelefono && <small className="text-danger">{errorTelefono}</small>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">🛒 Productos</h5>

            <div
              className="mb-3 border rounded p-2"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {productosCatalogo.map((prod, idx) => (
                <div key={idx} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`prod-${idx}`}
                    checked={!!productosSeleccionados.find((p) => p.nombre === prod.nombre)}
                    onChange={() => toggleProducto(prod)}
                  />
                  <label htmlFor={`prod-${idx}`} className="form-check-label">
                    {prod.nombre} - ${prod.precio.toLocaleString()}
                  </label>
                </div>
              ))}
            </div>

            <label>📝 Pedido generado</label>
            <textarea
              className="form-control mb-3"
              value={
                calcularResumenPedido().resumen +
                (productosSeleccionados.length
                  ? ` | TOTAL: $${calcularResumenPedido().total}`
                  : "")
              }
              readOnly
              rows={4}
            />

            <button type="submit" className="btn btn-success w-100 fw-bold">
              ✅ Agregar Pedido
            </button>
          </div>
        </div>
      </div>
    </form>
  ) : (
    <p>Cargando Google Maps...</p>
  );
};

export default PedidoForm;