const validator = require("validator");
const Article = require("../models/Article");

const create = (req, res) => {
  //Obtener params por post
  let params = req.body;

  //Validar los datos
  //Esto podria llevarlo a un handler o helper aparte y que lo valide aparte
  try {
    let validate_title =
      !validator.isEmpty(params.title) &&
      validator.isLength(params.title, { min: 5, max: 25 });
    let validate_content = !validator.isEmpty(params.content);

    if (!validate_title || !validate_content) {
      throw new Error("Invalid params");
    }
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

  if(req.params.last){
    //Solo meto el limite si llega un valor por parámetro
    query.limit(3);
  }

  query.sort({ date: -1 })
    .exec((error, articles) => {
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

module.exports = {
  create,
  getArticles,
};
