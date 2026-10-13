# Trabajo práctico 06 - Refactorización modular de reservas

## Proyecto de partida y cambios

Este proyecto parte de una copia del Trabajo práctico 05, que utilizaba Express, EJS y middleware para gestionar reservas de salas de estudio.

En el TP06 se reorganizó el código para separar el arranque del servidor, la configuración, la aplicación, las rutas, los controladores, el servicio y los middleware.

Se conservaron las vistas EJS, el layout, el CSS, los datos iniciales, Morgan, el identificador de solicitud y la validación de las reservas. También se mantiene el uso de CommonJS.

No se incorpora una base de datos ni persistencia en archivos. Las reservas se almacenan temporalmente en memoria.

## Instalación y ejecución

Para instalar las dependencias:

```bash
npm install
```

Para iniciar el servidor:

```bash
npm start
```

Para aplicar el formato al código:

```bash
npm run format
```

Para comprobar el formato y ejecutar el análisis estático:

```bash
npm run check
```

La aplicación utiliza el puerto 3000 de forma predeterminada y puede iniciarse sin un archivo `.env`.

## Configuración del entorno

La configuración se encuentra en `src/configuracion.js`.

Las variables utilizadas son:

- `PORT`: puerto en el que escucha el servidor. Su valor predeterminado es `3000`.
- `NODE_ENV`: entorno de ejecución. Su valor predeterminado es `development`.

El archivo `.env.example` contiene valores de ejemplo:

```env
PORT=3000
NODE_ENV=development
```

La configuración convierte `PORT` a número y rechaza valores que no sean enteros entre 1 y 65535, con un mensaje claro.

Morgan utiliza el formato `dev` durante el desarrollo y `combined` cuando `NODE_ENV=production`. Esto modifica el formato del registro, no el comportamiento de las rutas.

El archivo `.gitignore` excluye `node_modules/` y `.env`, para no publicar las dependencias instaladas ni las configuraciones locales.

## Mapa de módulos y dependencias

```text
src/
  index.js
  configuracion.js
  app.js
  rutas/
    reservas.js
  controladores/
    reservas.js
  servicios/
    reservas.js
  middleware/
    solicitudes.js
    reservas.js
```

### Responsabilidades

- `index.js`: crea los datos iniciales, obtiene la configuración, crea el servicio y el controlador, crea la aplicación e inicia el servidor.
- `configuracion.js`: lee y valida las variables de entorno.
- `app.js`: configura Express, EJS, el layout, los archivos estáticos, los middleware y las rutas principales. También define la respuesta final para las rutas inexistentes.
- `rutas/reservas.js`: relaciona los caminos y métodos HTTP con los middleware y los controladores.
- `controladores/reservas.js`: recibe los parámetros de las solicitudes, utiliza el servicio y prepara las respuestas HTML, los errores y las redirecciones.
- `servicios/reservas.js`: lista, busca, cuenta y crea reservas en un único arreglo compartido.
- `middleware/solicitudes.js`: genera el identificador de cada solicitud y mide su duración hasta el evento `finish`.
- `middleware/reservas.js`: prepara los datos locales de la sección y valida los datos recibidos desde el formulario.

### Separación de responsabilidades

El servicio no utiliza `req` ni `res` porque su responsabilidad es administrar los datos de las reservas, no responder solicitudes HTTP.

El controlador conecta las solicitudes con el servicio y decide qué respuesta enviar al navegador.

El router declara caminos relativos porque está montado en `/reservas` desde `app.js`. Por ejemplo, el camino `/nueva` dentro del router corresponde a `/reservas/nueva`.

La ruta `/nueva` se declara antes que `/:id` para que el texto `nueva` no se interprete como un identificador.

El único arreglo de reservas se crea en `index.js` y se entrega al servicio. El listado, el detalle, el contador de `/estado` y la creación utilizan esa misma instancia.

## Pipeline y contrato de rutas

El pipeline principal es:

1. Morgan.
2. Identificación de la solicitud.
3. Medición de duración.
4. Configuración de layouts.
5. Archivos estáticos.
6. Procesamiento de formularios con `express.urlencoded`.
7. Procesamiento de JSON con `express.json`.
8. Rutas principales.
9. Router de reservas.
10. Middleware final para rutas inexistentes.

Morgan registra las solicitudes que pasan por su middleware. El identificador y la medición propia también se ejecutan antes de los archivos estáticos, por lo que abarcan solicitudes de CSS y de las rutas de la aplicación. La medición termina cuando la respuesta emite el evento `finish`.

### Rutas y respuestas esperadas

| Método y camino | Comportamiento esperado |
|---|---|
| `GET /` | Página principal, HTTP 200 |
| `GET /estado` | JSON con el estado, la cantidad de reservas y el identificador de solicitud |
| `GET /reservas` | Listado de reservas, HTTP 200 |
| `GET /reservas/nueva` | Formulario de nueva reserva, HTTP 200 |
| `GET /reservas/:id` | Detalle, HTTP 200, o vista HTML 404 |
| `POST /reservas` | HTTP 302 si los datos son válidos; HTTP 400 si son inválidos |
| `GET /css/estilos.css` | Archivo CSS, HTTP 200 cuando se sirve normalmente |
| Ruta inexistente | Vista HTML, HTTP 404 |

## Validación de reservas

La validación se realiza en el servidor antes de crear una reserva.

Se comprueba que:

- Todos los campos sean obligatorios.
- El email contenga `@`.
- La sala pertenezca a las opciones permitidas.
- El turno sea Mañana, Tarde o Noche.
- La cantidad de personas sea un número entero entre 1 y 6.

El procesamiento de formularios con `express.urlencoded` se ejecuta antes del validador.

Cuando los datos son inválidos, se responde con HTTP 400, se muestra el mensaje de error y se conservan los valores ingresados. No se crea una reserva y el middleware no continúa hacia el controlador.

Cuando los datos son válidos, se prepara `req.reservaValidada`, se crea la reserva mediante el servicio y se redirige a `/reservas` con HTTP 302. La página de destino responde HTTP 200.

## Persistencia temporal y límites

Las reservas se almacenan en un arreglo en memoria. No se utiliza MongoDB ni otra base de datos.

El listado, el detalle, la creación y el endpoint `/estado` utilizan el mismo servicio de reservas.

Cuando se reinicia el servidor, las reservas creadas durante la ejecución se pierden y se recuperan los cuatro datos iniciales definidos en `index.js`.

## Formato y análisis estático

Las herramientas de desarrollo son Prettier, ESLint y `@eslint/js`.

Los comandos disponibles son:

| Comando | Función |
|---|---|
| `npm start` | Inicia el servidor |
| `npm run format` | Aplica Prettier al código de `src` |
| `npm run format:check` | Comprueba el formato sin modificar archivos |
| `npm run lint` | Analiza el código de `src` con ESLint |
| `npm run check` | Comprueba el formato y ejecuta ESLint |

### Resultados registrados durante el desarrollo

- `npm install`: finalizó correctamente y mostró cero vulnerabilidades.
- `npm run format`: se ejecutó para aplicar el formato.
- `npm run check`: Prettier y ESLint terminaron sin errores.
- `npm start`: el servidor inició correctamente en el puerto 3000.
- Se comprobó que el estado inicial contiene cuatro reservas.
- Se comprobó que un POST inválido responde HTTP 400 y no aumenta el contador.
- Se comprobó que un POST válido responde HTTP 302, crea una reserva y aumenta el contador a cinco.
- Se comprobó que el listado, el formulario y el detalle de la reserva de prueba responden HTTP 200.
- Se comprobó que el detalle inexistente y una URL inexistente responden HTTP 404.
- Se comprobó que el CSS responde HTTP 200.
- Se comprobó que, al reiniciar el servidor, se recuperan las cuatro reservas iniciales.
- Se comprobó que el puerto alternativo `3001` responde HTTP 200.
- Se comprobó que el puerto inválido `70000` produce un error de validación y evita que el servidor inicie.

## Matriz de pruebas antes/después

La consigna requiere comparar la conducta del TP05 original con la del TP06 modular. Los resultados del TP05 deben completarse ejecutando las mismas pruebas sobre la copia original; no se atribuyen resultados que todavía no se hayan comprobado.

| Prueba | TP05 original | TP06 modular |
|---|---|---|
| Inicio `GET /` | Pendiente de verificar | Pendiente de registrar el código HTTP |
| Estado inicial `GET /estado` | Pendiente de verificar | HTTP 200; cuatro reservas iniciales |
| Listado `GET /reservas` | Pendiente de verificar | HTTP 200 |
| Formulario `GET /reservas/nueva` | Pendiente de verificar | HTTP 200 |
| Detalle existente `GET /reservas/5` | Pendiente de verificar | HTTP 200 durante la prueba |
| POST con campos vacíos | Pendiente de verificar | HTTP 400; no se creó una reserva |
| POST válido | Pendiente de verificar | HTTP 302; se creó una reserva de prueba con ID 5 |
| Estado después del POST válido | Pendiente de verificar | HTTP 200; el contador aumentó a cinco |
| Detalle inexistente `GET /reservas/999` | Pendiente de verificar | HTTP 404 |
| URL inexistente | Pendiente de verificar | HTTP 404 |
| CSS `/css/estilos.css` | Pendiente de verificar | HTTP 200 |
| Reinicio del servidor | Pendiente de verificar | Se recuperaron las cuatro reservas iniciales |
| Puerto alternativo `3001` | Pendiente de verificar | HTTP 200 |
| Puerto inválido `70000` | Pendiente de verificar | Error claro; el servidor no inicia |

### Validaciones adicionales pendientes de registrar

La consigna también solicita comprobar por separado:

- Una sala no permitida.
- Un email sin `@`.
- Cantidad de personas igual a `0`.
- Cantidad de personas igual a `7`.
- Cantidad de personas fraccionaria.
- Los registros de Morgan y la medición propia para respuestas HTTP 200, 302, 400 y 404.

Estos casos deben registrarse después de ejecutarlos, sin dar por aprobadas pruebas que todavía no se realizaron.

Las respuestas HTTP 304 pueden aparecer cuando el navegador utiliza la caché; por eso, para la matriz se deben registrar solicitudes nuevas cuando sea posible.

## Entrega

El proyecto utiliza CommonJS y no incorpora base de datos, persistencia en archivos
Repositorio: https://github.com/picon2025/trabajo-practico-06-salas-modular


