const express = require("express");
const multer = require("multer");
const ArticleController = require("../controllers/articleCtrl");
const router = express.Router();

//Config de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //cb es donde está el directorio
    cb(null, "./img/articles");
  },

  filename: (req, file, cb) => {
    //Armo el nombre por defecto que va a tener el archivo
    cb(null, "article" + Date.now() + file.originalname);
  },
});

const uploads = multer({ storage: storage });

//Fin config de multer

//Rutas de prueba
router.post("/create", ArticleController.createArticle);
router.get("/articles/:last?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getOneArticle);
router.delete("/article/:id", ArticleController.deleteArticle);
router.put("/article/:id", ArticleController.editArticle);
//uploads.single porque es un solo archivo, esto es un middleware. File es el nombre que se le da al param
router.post(
  "/upload-file/:id",
  [uploads.single("file")],
  ArticleController.uploadFile
);
router.get("/image/:file", ArticleController.image);
router.get("/seeker/:search", ArticleController.seeker);


module.exports = router;
