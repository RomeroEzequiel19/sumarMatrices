const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

// Crear un servidor HTTP
const server = http.createServer((req, res) => {
  // Obtener la ruta solicitada por el cliente
  const reqUrl = url.parse(req.url, true);

  // Manejar diferentes rutas
  if (reqUrl.pathname === "/") {
    // Si la solicitud es para la ruta raíz, servir el archivo index.html
    const indexPath = path.join(__dirname, "index.html");
    serveFile(res, indexPath);
  } else if (reqUrl.pathname === "/calcular") {
    // Si la solicitud es para calcular la suma, ejecutar la lógica y enviar el resultado
    calcularSuma(req, res);
  } else {
    // Si la ruta no se reconoce, responder con un código de error 404
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Error 404: Archivo no encontrado");
  }
});

// Función para servir un archivo
function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Si hay un error al leer el archivo, responder con un código de error 500
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error interno del servidor");
    } else {
      // Si se pudo leer el archivo, responder con el contenido del archivo
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    }
  });
}

// Función para calcular la suma de matrices
function calcularSuma(req, res) {
  let body = [];
  req
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      // Convertir los datos recibidos a un objeto JSON
      body = Buffer.concat(body).toString();
      const matrices = JSON.parse(body);

      // Realizar la suma de matrices
      const resultado = [];
      for (let i = 0; i < matrices[0].length; i++) {
        resultado.push([]);
        for (let j = 0; j < matrices[0][0].length; j++) {
          resultado[i].push(matrices[0][i][j] + matrices[1][i][j]);
        }
      }

      // Enviar el resultado como JSON al cliente
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(resultado));
    });
}

// Puerto en el que escuchará el servidor
const port = 3000;

// Iniciar el servidor y escuchar en el puerto especificado
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}/`);
});
