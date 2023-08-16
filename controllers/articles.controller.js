const { selectArticleById, selectArticles, selectArticleComments} = require('../models/article.model')

exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    selectArticleById(article_id)
      .then((article) => {
        response.status(200).send({ article });
      })
      .catch((error) => {
        next(error);
      });
  };

  exports.getArticles = (request, response, next) => {
    selectArticles().then((articles) => {
      response.status(200).send({ articles });
    });
  };
  exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params
    selectArticleComments(article_id).then(comments => {
        res.status(200).send(comments)
    }).catch(err => next(err))
}