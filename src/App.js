import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VendedorView from "./views/VendedorView";
import AdminLogin from "./views/AdminLogin";
import AdminPedidos from "./views/AdminPedidos";
import LoginVendedor from "./views/LoginVendedor";
import Home from "./views/Home";
import RepartidorView from "./views/RepartidorView";
import LoginRepartidor from "./views/LoginRepartidor";


function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Home />} /> {/* 👈 Ahora la vista inicial */}
        <Route path="/login-vendedor" element={<LoginVendedor />} />
        <Route path="/vendedor" element={<VendedorView />} /> {/* 👈 antes era "/" */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
        
<Route path="/login-repartidor" element={<LoginRepartidor />} />
<Route path="/repartidor" element={<RepartidorView />} />
      </Routes>
    </Router>
  );
}

export default App;
