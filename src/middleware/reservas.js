function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";

  next();
}

function validarReserva(req, res, next) {
  const estudiante = String(req.body.estudiante ?? "").trim();
  const email = String(req.body.email ?? "").trim();
  const sala = String(req.body.sala ?? "").trim();
  const fecha = String(req.body.fecha ?? "").trim();
  const turno = String(req.body.turno ?? "").trim();
  const personasTexto = String(req.body.personas ?? "").trim();

  const personas = Number(personasTexto);

  const valores = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas: personasTexto,
  };

  const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];

  const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

  let error = "";

  if (!estudiante || !email || !sala || !fecha || !turno || !personasTexto) {
    error = "Todos los campos son obligatorios.";
  } else if (!email.includes("@")) {
    error = "El email debe contener @.";
  } else if (!salasPermitidas.includes(sala)) {
    error = "La sala seleccionada no es válida.";
  } else if (!turnosPermitidos.includes(turno)) {
    error = "El turno seleccionado no es válido.";
  } else if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    error = "La cantidad de personas debe ser un nUmero  entre 1 y 6.";
  }

  if (error) {
    return res.status(400).render("reservas/nueva", {
      title: "Nueva reserva",
      error,
      valores,
    });
  }

  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas,
  };

  next();
}

module.exports = {
  prepararAreaReservas,
  validarReserva,
};
