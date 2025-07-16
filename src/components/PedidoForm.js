import React, { useRef, useState ,useEffect} from "react";
import { useForm } from "react-hook-form";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import Swal from "sweetalert2";
import { GoogleMap, Marker } from "@react-google-maps/api";
import './PedidoForm.css';


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

const PedidoForm = ({ onAgregar, onActualizar, pedidoAEditar }) => {
  const autoCompleteRef = useRef(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [coordenadas, setCoordenadas] = useState(null);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [partido, setPartido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [entreCalles, setEntreCalles] = useState("");

  const [errorNombre, setErrorNombre] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });

  useEffect(() => {
    if (pedidoAEditar) {
      setNombre(pedidoAEditar.nombre || "");
      setTelefono(pedidoAEditar.telefono || "");
      setDireccion(pedidoAEditar.direccion || "");
      setEntreCalles(pedidoAEditar.entreCalles || "");
      setPartido(pedidoAEditar.partido || "");

      const nuevosProductos = [];
      productosCatalogo.forEach((p) => {
        const regex = new RegExp(`${p.nombre} x(\\d+)`);
        const match = pedidoAEditar.pedido.match(regex);
        if (match) {
          nuevosProductos.push({ ...p, cantidad: parseInt(match[1]) });
        }
      });
      setProductosSeleccionados(nuevosProductos);
    }
  }, [pedidoAEditar]);

  const handlePlaceChanged = () => {
    const place = autoCompleteRef.current.getPlace();
    const direccionCompleta = place.formatted_address || "";
    const plusCode = place.plus_code?.global_code || "";
    const direccionFinal = plusCode
      ? `${plusCode} - ${direccionCompleta}`
      : direccionCompleta;
    setDireccion(direccionFinal);

    const location = place.geometry?.location;
    if (location) {
      setCoordenadas({
        lat: location.lat(),
        lng: location.lng()
      });
    }
  };

  const calcularResumenPedido = () => {
    const resumen = productosSeleccionados
      .map(p => `${p.nombre} x${p.cantidad} ($${p.precio * p.cantidad})`)
      .join(" - ");
    const total = productosSeleccionados.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    return { resumen, total };
  };

  const resetFormulario = () => {
    setNombre("");
    setTelefono("");
    setPartido("");
    setDireccion("");
    setEntreCalles("");
    setProductosSeleccionados([]);
  };

 const onSubmit = () => {
  // Validaciones fuertes
  if (
    !nombre.trim() ||
    !telefono.trim() ||
    !direccion.trim() ||
    productosSeleccionados.length === 0 ||
    errorNombre ||
    errorTelefono
  ) {
    return Swal.fire("❌ Por favor completá todos los campos requeridos y agregá al menos un producto.");
  }

  const { resumen, total } = calcularResumenPedido();
  const pedidoFinal = `${resumen} | TOTAL: $${total}`;

  const pedidoConProductos = {
    nombre,
    telefono,
    partido,
    direccion,
    entreCalles,
    pedido: pedidoFinal,
    coordenadas,
  };

  pedidoAEditar
    ? onActualizar({ ...pedidoAEditar, ...pedidoConProductos })
    : onAgregar(pedidoConProductos);

  resetFormulario();
};
  return isLoaded ? (
<form
  onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
  onKeyDown={(e) => {
    if (e.key === "Enter") e.preventDefault();
  }}
  className="mb-5"
>
      <div className="row g-4">
        <div className="col-md-6">
  <div className="card shadow-sm p-4 rounded-4 bg-light">
    <h5 className="mb-4 fw-bold fs-4">🧑 Datos del cliente</h5>

    <div className="mb-3">
      <label className="form-label"> Nombre</label>
      <div className="input-group">
        <span className="input-group-text">👤</span>
        <input className="form-control" value={nombre} onChange={(e) => {
          const val = e.target.value;
          setNombre(val);
          setErrorNombre(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val) ? "" : "❌ Solo letras y espacios.");
        }} />
      </div>
      {errorNombre && <div className="text-danger small mt-1">{errorNombre}</div>}
    </div>

    <div className="mb-3">
  <label className="form-label"> Calle y Altura</label>
  <div className="input-group">
    <span className="input-group-text">🏠</span>
   <div style={{ flex: 1 }}>
  <Autocomplete
    onLoad={(autocomplete) => (autoCompleteRef.current = autocomplete)}
    onPlaceChanged={handlePlaceChanged}
  >
    <input
      className="form-control px-3 py-2"
      style={{ fontSize: "16px", width: "100%" }}
      value={direccion}
      onChange={(e) => setDireccion(e.target.value)}
      placeholder="Buscar dirección"
    />
  </Autocomplete>
</div>
  </div>
</div>

    {coordenadas && (
      <div className="mb-3 rounded overflow-hidden border" style={{ height: "200px" }}>
        <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={coordenadas} zoom={16}>
          <Marker position={coordenadas} />
        </GoogleMap>
      </div>
    )}

    <div className="mb-3">
      <label className="form-label"> Observación (Entre calles)</label>
      <div className="input-group">
        <span className="input-group-text">🗒️</span>
        <input className="form-control" value={entreCalles} onChange={(e) => setEntreCalles(e.target.value)} />
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label"> Ciudad o partido</label>
      <div className="input-group">
        <span className="input-group-text">🌆</span>
        <input className="form-control" value={partido} onChange={(e) => setPartido(e.target.value)} />
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label"> Teléfono</label>
      <div className="input-group">
        <span className="input-group-text">📞</span>
        <input className="form-control" value={telefono} onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "");
          setTelefono(val);
          setErrorTelefono(/^[0-9]{6,15}$/.test(val) ? "" : "❌ Solo números (6 a 15 dígitos).");
        }} />
      </div>
      {errorTelefono && <div className="text-danger small mt-1">{errorTelefono}</div>}
    </div>
  </div>
</div>

        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">🛒 Productos</h5>

            <div className="mb-3 border rounded p-2" style={{ maxHeight: "300px", overflowY: "auto", fontSize: "14px" }}>
              {productosCatalogo.map((prod, idx) => {
                const cantidad = productosSeleccionados.find(p => p.nombre === prod.nombre)?.cantidad || 0;
                return (
                  <div key={idx} className="d-flex justify-content-between align-items-center mb-1">
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                     <strong>{prod.nombre}</strong> - ${prod.precio.toLocaleString()}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={cantidad}
                      onChange={(e) => {
                        const cant = parseInt(e.target.value, 10);
                        setProductosSeleccionados((prev) => {
                          const sinEste = prev.filter(p => p.nombre !== prod.nombre);
                          return cant > 0 ? [...sinEste, { ...prod, cantidad: cant }] : sinEste;
                        });
                      }}
                      className="form-control ms-2"
                      style={{ width: "60px", fontSize: "13px", padding: "2px 6px" }}
                    />
                  </div>
                );
              })}
            </div>

            <label>📝 Pedido generado</label>
            <textarea
              className="form-control mb-3"
              value={
                calcularResumenPedido().resumen +
                (productosSeleccionados.length ? ` | TOTAL: $${calcularResumenPedido().total}` : "")
              }
              readOnly
              rows={4}
            />

            <button type="submit" className={`btn ${pedidoAEditar ? "btn-warning" : "btn-success"} w-100 fw-bold`}>
              {pedidoAEditar ? "✏️ Actualizar Pedido" : "✅ Agregar Pedido"}
            </button>
          </div>
        </div>
      </div>
    </form>
  ) : <p>Cargando Google Maps...</p>;
};

export default PedidoForm;