function crearControladorReservas(servicio) {
  // Muestra todas las reservas
  function listar(req, res) {
    res.render("reservas/lista", {
      title: "Reservas de salas",
      reservas: servicio.listar(),
    });
  }

  // Muestra el formulario para crear una reserva
  function nueva(req, res) {
    res.render("reservas/nueva", {
      title: "Nueva reserva",
      error: null,
      valores: {
        estudiante: "",
        email: "",
        sala: "Sala Norte",
        fecha: "",
        turno: "Mañana",
        personas: "",
      },
    });
  }

  // Muestra el detalle de una reserva
  function detalle(req, res) {
    const id = Number(req.params.id);
    const reserva = servicio.buscarPorId(id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        title: "Reserva no encontrada",
      });
    }

    res.render("reservas/detalle", {
      title: `Reserva ${reserva.id}`,
      reserva,
    });
  }

  // Crea una reserva con los datos validados
  function crear(req, res) {
    servicio.crear(req.reservaValidada);
    res.redirect("/reservas");
  }

  return {
    listar,
    nueva,
    detalle,
    crear,
  };
}

module.exports = crearControladorReservas;
