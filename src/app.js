const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");
const crearRouterReservas = require("./rutas/reservas");

function crearApp(servicioReservas, controladorReservas, NODE_ENV) {
  const app = express();

  // Configuracion de las vistas EJS
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("layout", "layouts/main");

  // Registra las solicitudes segun el entorno
  if (NODE_ENV === "production") {
    app.use(morgan("combined"));
  } else {
    app.use(morgan("dev"));
  }

  // Identifica cada solicitud y mide su duracion
  app.use(identificarSolicitud);
  app.use(medirDuracion);

  // Configura los layouts y los archivos publicos
  app.use(expressLayouts);
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Permite recibir datos de formularios y JSON
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Pagina principal
  app.get("/", (req, res) => {
    res.render("inicio", {
      title: "Reservas de salas de estudio",
    });
  });

  // Estado del servicio y cantidad actual de reservas
  app.get("/estado", (req, res) => {
    res.json({
      servicio: "activo",
      reservas: servicioReservas.contar(),
      solicitudId: res.locals.solicitudId,
    });
  });

  // Conecta las rutas de reservas
  app.use("/reservas", crearRouterReservas(controladorReservas));

  // Responde cuando la ruta solicitada no existe
  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      title: "Pagina no encontrada",
    });
  });

  return app;
}

module.exports = crearApp;
