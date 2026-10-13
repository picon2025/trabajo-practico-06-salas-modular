function crearServicioReservas(datosIniciales) {
  // Este arreglo sera compartido por toda la aplicacion
  const reservas = datosIniciales;

  // Devuelve todas las reservas
  function listar() {
    return reservas;
  }

  // Busca una reserva por su ID
  function buscarPorId(id) {
    return reservas.find((reserva) => reserva.id === id);
  }

  // Devuelve la cantidad de reservas
  function contar() {
    return reservas.length;
  }

  // Agrega una nueva reserva
  function crear(datos) {
    const nuevoId =
      reservas.length > 0
        ? Math.max(...reservas.map((reserva) => reserva.id)) + 1
        : 1;

    const nuevaReserva = {
      id: nuevoId,
      ...datos,
    };

    reservas.push(nuevaReserva);

    return nuevaReserva;
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear,
  };
}

module.exports = crearServicioReservas;
