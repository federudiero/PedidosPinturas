// components/EditarPedidoModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditarPedidoModal = ({ show, onClose, pedido, onGuardar }) => {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    entreCalles: "",
    partido: "",
    telefono: "",
    pedido: ""
  });

  useEffect(() => {
    if (pedido) setForm({ ...pedido });
  }, [pedido]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    onGuardar(form);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>✏️ Editar Pedido</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {["nombre", "direccion", "entreCalles", "partido", "telefono", "pedido"].map((campo, i) => (
            <Form.Group className="mb-3" key={i}>
              <Form.Label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</Form.Label>
              <Form.Control
                as={campo === "pedido" ? "textarea" : "input"}
                rows={campo === "pedido" ? 3 : undefined}
                name={campo}
                value={form[campo]}
                onChange={handleChange}
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditarPedidoModal;
