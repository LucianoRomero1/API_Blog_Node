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
app.use(express.json()); //Recibir datos con content-type app/json y este sirve para enviarlos como raw desde Postman
app.use(express.urlencoded({extended: true})); //Convertir cada propiedad a json, esto sirve para cuando envío los params desde www-form-urlencoded en Postman

//Cargar rutas
const article_routes = require("./routes/article");

app.use("/api", article_routes);

//Crear servidor y escuchar peticiones
app.listen(port, () => {
  console.log("Server running on port " + port);
});
