const {
  selectTopics,
  selectArticlesById,
  updateById,
  selectArticles, 
  selectCommentsByArticleId, postCommentById
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
  const { sort_by } = req.query
  const { order_by } = req.query
  const { topic } = req.query

  selectArticles(sort_by, order_by, topic)
  .then((articles) => {
    res.status(200).send({ articles: articles });
  })
  .catch(next)
};

exports.getCommentsByArticleId = (req, res, next) => {
  const {article_id} = req.params
selectCommentsByArticleId(article_id)
.then((comments) => {
  res.status(200).send({comments: comments})
})
.catch(next)
}

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username } = req.body;
  const { body } = req.body;
  postCommentById(article_id, username, body)
  .then((newComment) => {
res.status(201).send({newComment: newComment})
  })
  .catch(next)
}
