const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Inicializar App
console.log("Hello world");

//Conectar a la DB
connection();

//Crear servidor de Node
const app = express();
const port = 3900;

//Configurar CORS
app.use(cors());

//Convertir body a objeto JS
app.use(express.json());

//Crear rutas

//Crear servidor y escuchar peticiones
app.listen(port, () => {
  console.log("Server running on port " + port);
});
