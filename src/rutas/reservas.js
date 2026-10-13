const express = require("express");

const {
  prepararAreaReservas,
  validarReserva,
} = require("../middleware/reservas");

// Crea el router y recibe el controlador
function crearRouterReservas(controlador) {
  const router = express.Router();

  // Prepara la seccion de reservas
  router.use(prepararAreaReservas);

  // Listado de reservas
  router.get("/", controlador.listar);

  // Formulario de nueva reserva
  // Debe ir antes de /:id
  router.get("/nueva", controlador.nueva);

  // Crear una reserva
  router.post("/", validarReserva, controlador.crear);

  // Detalle de una reserva
  router.get("/:id", controlador.detalle);

  return router;
}

module.exports = crearRouterReservas;
