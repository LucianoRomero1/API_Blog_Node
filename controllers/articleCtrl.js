const Article = require("../models/Article");
const { validateArticle } = require("../helpers/validate");
//trabajo con archivos
const fileSystem = require("fs");
const path = require("path");

const createArticle = (req, res) => {
  //Obtener params por post
  let params = req.body;

  //Validar los datos
  //Esto podria llevarlo a un handler o helper aparte y que lo valide aparte
  try {
    validateArticle(params);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Missing some params",
    });
  }

  //Crear el objeto basado en un modelo a guardar - Pasandole el params como parámetro, lo hace de manera automatica a los SET
  const article = new Article(params);

  //Asignar valores al objeto manual
  // article.title(params.title)

  //Guardar articulo en la DB
  article.save((error, savedArticle) => {
    if (error || !savedArticle) {
      return res.status(400).json({
        status: "error",
        message: "The data could not be saved",
      });
    }

    //Devolver resultado
    return res.status(200).send({
      status: "Success",
      article: savedArticle,
      message: "Article has been created",
    });
  });
};

const getArticles = (req, res) => {
  //exec parece ser mejor que hacer el callback dentro de find
  //-1 es como hacer un order DESC
  let query = Article.find({});

  if (req.params.last) {
    //Solo meto el limite si llega un valor por parámetro
    query.limit(3);
  }

  query.sort({ date: -1 }).exec((error, articles) => {
    if (error || !articles) {
      return res.status(404).json({
        status: "error",
        message: "Articles not found",
      });
    }

    return res.status(200).send({
      status: "success",
      count: articles.length,
      articles: articles,
    });
  });
};

const getOneArticle = (req, res) => {
  //Recoger id por la url
  let id = req.params.id;

  //Buscar el articulo, siempre el callback busca el error y sino el articulo
  Article.findById(id, (error, article) => {
    if (error || !article) {
      return res.status(404).json({
        status: "error",
        message: "Article not found",
      });
    }

    return res.status(200).json({
      status: "success",
      article,
    });
  });
};

const deleteArticle = (req, res) => {
  let id = req.params.id;

  Article.findOneAndDelete({ _id: id }, (error, article) => {
    if (error || !article) {
      return res.status(500).json({
        status: "error",
        message: "Article not found",
      });
    }

    return res.status(200).json({
      status: "success",
      article,
      message: "Article deleted",
    });
  });
};

const editArticle = (req, res) => {
  //Obtener el id de la request
  let id = req.params.id;

  //Obtener datos del body
  let params = req.body;
  try {
    validateArticle(params);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Missing some params",
    });
  }

  //Buscar y actualizar el articulo
  //con New true me devuelve el objeto actualizado
  Article.findByIdAndUpdate(
    { _id: id },
    params,
    { new: true },
    (error, article) => {
      if (error || !article) {
        return res.status(404).json({
          status: "error",
          message: "Article could not be edit",
        });
      }

      return res.status(200).json({
        status: "success",
        article,
      });
    }
  );
};

const uploadFile = (req, res) => {
  //Configurar multer

  //Obtener el fichero de imagen subido
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      message: "Invalid request",
    });
  }

  //Conseguir nombre de la imagen
  let file = req.file.originalname;

  //Extension del archivo
  let splitFile = file.split(".");
  let extension = splitFile[1];

  //Validar extension
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    //Borrar archivo para que no se cargue en la carpeta img y retornar error
    fileSystem.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        message: "Invalid image format. Just accept png, jpg, jpeg or gif",
      });
    });
  } else {
    //Obtener id del articulo
    let id = req.params.id;

    //Buscar y actualizar el articulo
    //con New true me devuelve el objeto actualizado
    Article.findByIdAndUpdate(
      { _id: id },
      { img: req.file.filename },
      { new: true },
      (error, article) => {
        if (error || !article) {
          fileSystem.unlink(req.file.path, (error) => {
            return res.status(404).json({
              status: "error",
              message: "Article could not be edit",
            });
          });
        } else {
          return res.status(200).json({
            status: "success",
            article: article,
            file: req.file,
          });
        }
      }
    );
  }
};

const image = (req, res) => {
  let file = req.params.file;

  let physicalPath = "./img/articles/" + file;

  fileSystem.stat(physicalPath, (error, exist) => {
    if(exist){
      return res.sendFile(path.resolve(physicalPath));
    }else{
      return res.status(404).json({
        status: "error",
        message: "Imagen doesn't exist",
      });
    }
  });
};

const seeker = (req, res) => {
  //Sacar el string de la busqueda
  let search = req.params.search;

  //Find OR 
  Article.find({"$or": [
    //Con la i en options pongo que el titulo incluya el string de busqueda
    {"title": {"$regex": search, "$options": "i"}},
    {"content": {"$regex": search, "$options": "i"}},
  ]})
  .sort({date: -1})
  .exec((error, foundArticles) => {
    if(error || !foundArticles || foundArticles.length <= 0){
      return res.status(404).json({
        status: "error",
        message: "No results found",
      });
    }

    return res.status(200).json({
      status: "success",
      foundArticles
    })
  });

  //Orden

  //Ejecutar consulta

  //Devolver resultado
}

module.exports = {
  createArticle,
  getArticles,
  getOneArticle,
  deleteArticle,
  editArticle,
  uploadFile,
  image,
  seeker
};
