import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

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
  const { register, handleSubmit, reset, setValue } = useForm();
  const autoCompleteRef = useRef(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });

const handlePlaceChanged = () => {
  const place = autoCompleteRef.current.getPlace();

  const direccionCompleta = place.formatted_address || "";
  const plusCode = place.plus_code?.global_code || "";

  // Si hay plusCode, anteponerlo a la dirección
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
  const { resumen, total } = calcularResumenPedido();
  const pedidoFinal = `${resumen} | TOTAL: $${total}`;

  const pedidoConProductos = {
    ...data,
    pedido: pedidoFinal
  };

  onAgregar(pedidoConProductos);
  setProductosSeleccionados([]);
  reset();
};

  return isLoaded ? (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <div className="row">
        <div className="col-md-6">
          <label>👤 Nombre</label>
          <input {...register("nombre", { required: true })} className="form-control mb-2" />

          <label>🏠 Calle y Altura</label>
          <Autocomplete
            onLoad={(autocomplete) => (autoCompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              {...register("direccion", { required: true })}
              className="form-control mb-2"
              placeholder="Buscar dirección"
            />
          </Autocomplete>

          <label>🗒️ Observación</label>
          <input {...register("entreCalles" )} className="form-control mb-2" />

          <label>🌆 Ciudad</label>
          <input {...register("partido")} className="form-control mb-2" />

          <label>📞 Teléfono</label>
          <input {...register("telefono")} className="form-control mb-2" />
        </div>

        <div className="col-md-6">
          <label>🧾 Seleccionar productos</label>
          <div className="mb-2">
            {productosCatalogo.map((prod, idx) => (
              <div key={idx} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`prod-${idx}`}
                  checked={!!productosSeleccionados.find(p => p.nombre === prod.nombre)}
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
            className="form-control"
            value={calcularResumenPedido().resumen + (productosSeleccionados.length ? ` | TOTAL: $${calcularResumenPedido().total}` : "")}
            readOnly
            rows={4}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-3">Agregar Pedido</button>
    </form>
  ) : (
    <p>Cargando Google Maps...</p>
  );
};

export default PedidoForm;
