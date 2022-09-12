const express = require("express");
const router = express.Router();

const ArticleController = require("../controllers/articleCtrl");

//Rutas de prueba
router.post("/create", ArticleController.create);
router.get("/articles/:last?", ArticleController.getArticles);

module.exports = router;
