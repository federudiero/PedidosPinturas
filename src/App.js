import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VendedorView from "./views/VendedorView";
import AdminLogin from "./views/AdminLogin";
import AdminPedidos from "./views/AdminPedidos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VendedorView />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
      </Routes>
    </Router>
  );
}

export default App;
