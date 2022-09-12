const { Schema, model } = require("mongoose");

const ArticleSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  img: {
    type: String,
    default: "default.png",
  },
});

//Ese tercer parámetro es el nombre de la coleccion, no es obligatorio
module.exports = model("Article", ArticleSchema, "articles");