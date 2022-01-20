const {
  selectTopics,
  selectArticlesById,
  updateById,
  selectArticles,
} = require("../models/app.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch(next);
};
exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateById(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(201).send({ updatedArticle: updatedArticle });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by} = req.query
  const {order_by} = req.query
  const {topic } = req.query

  selectArticles(sort_by, order_by, topic)
  .then((articles) => {
    console.log(articles)
    res.status(200).send({ articles: articles });
  })
  .catch(next)
};
