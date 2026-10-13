const crearServicioReservas = require("./servicios/reservas");
const crearControladorReservas = require("./controladores/reservas");
const cargarConfiguracion = require("./configuracion");
const crearApp = require("./app");

// Reservas iniciales de la aplicacion
const reservasIniciales = [
  {
    id: 1,
    estudiante: "Liam Galajer",
    email: "liam@example.com",
    sala: "Sala Norte",
    fecha: "2026-09-22",
    turno: "Mañana",
    personas: 2,
  },
  {
    id: 2,
    estudiante: "slash",
    email: "slash@example.com",
    sala: "Sala Sur",
    fecha: "2026-09-22",
    turno: "Tarde",
    personas: 4,
  },
  {
    id: 3,
    estudiante: "hendrix jimi",
    email: "jimi@example.com",
    sala: "Sala Multimedia",
    fecha: "2026-09-23",
    turno: "Noche",
    personas: 3,
  },
  {
    id: 4,
    estudiante: "axel william",
    email: "axel@example.com",
    sala: "Sala Norte",
    fecha: "2026-09-24",
    turno: "Tarde",
    personas: 1,
  },
];

// Carga la configuracion del servidor
const { PORT, NODE_ENV } = cargarConfiguracion();

// Crea una sola instancia del servicio para compartir las reservas
const servicioReservas = crearServicioReservas(reservasIniciales);

// Crea el controlador que utiliza ese servicio
const controladorReservas = crearControladorReservas(servicioReservas);

// Configura la aplicacion Express
const app = crearApp(servicioReservas, controladorReservas, NODE_ENV);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
