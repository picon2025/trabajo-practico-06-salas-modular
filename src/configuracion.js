function cargarConfiguracion() {
  const puertoTexto = process.env.PORT ?? "3000";
  const PORT = Number(puertoTexto);

  if (
    !/^\d+$/.test(puertoTexto) ||
    !Number.isInteger(PORT) ||
    PORT < 1 ||
    PORT > 65535
  ) {
    throw new Error(
      "PORT invalido: debe ser un numero entero entre 1 y 65535.",
    );
  }

  const NODE_ENV = process.env.NODE_ENV ?? "development";

  return {
    PORT,
    NODE_ENV,
  };
}

module.exports = cargarConfiguracion;
