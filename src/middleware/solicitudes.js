let contadorSolicitudes = 0;

// Asigna un identificador unico a cada solicitud
function identificarSolicitud(req, res, next) {
  contadorSolicitudes++;

  const numero = String(contadorSolicitudes).padStart(4, "0");
  const solicitudId = `BIB-${numero}`;

  res.locals.solicitudId = solicitudId;

  next();
}

// Mide cuanto tarda en terminar una solicitud
function medirDuracion(req, res, next) {
  const inicio = process.hrtime.bigint();

  res.on("finish", () => {
    const fin = process.hrtime.bigint();
    const duracion = Number(fin - inicio) / 1_000_000;

    console.log(
      `[${res.locals.solicitudId}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duracion} ms`,
    );
  });

  next();
}

module.exports = {
  identificarSolicitud,
  medirDuracion,
};
