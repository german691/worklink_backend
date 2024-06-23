//mongodb connection
require("dotenv").config();

require("./config/db");

const express = require("express");

//con esto podemos enviar solicitudes JSON a nuestros request del sv
const bodyParser = express.json;

//cors sirve para hacer request a este backend
const cors = require("cors");

//importamos el ruteador de express que hicimos
const routes = require("./routes");

//creamos el sv con express
const app = express();

//Actualmente no necesitado
app.use(cors());
app.use(bodyParser());

//este es el endpoint del api para registro (tipo acá apuntamos por ejemplo con postman para probar añadir un usuario)
app.use("/api/v1", routes);

module.exports = app;

