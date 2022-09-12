//Archivo para crear la conexion a la DB
const mongoose = require("mongoose");

const connection = async () => {
  try {
    //Le paso la url de mongoDB con los params y el nombre de la DB
    await mongoose.connect("mongodb://localhost:27017/my_blog");

    //Parámetros por si da error el connect
    //useNewUrlParser: true
    //useUnifiedTopology: true
    //useCreateIndex: true
    console.log("Connected to DB my_blog");
  } catch (error) {
    console.log(error);
    throw new Error("Can´t connect to database");
  }
};

module.exports = {
  connection,
};
