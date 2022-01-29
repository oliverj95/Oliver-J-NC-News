const {
  selectTopics,
  selectArticlesById,
  updateById,
  selectArticles, 
  selectCommentsByArticleId, postCommentById, deleteCommentById, retrieveEndpoints, retrieveUsers
} = require("../models/app.model");

const endpoints = require("../endpoints.json")

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

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
  .then(() => {
    res.status(204).send({})
  })
  .catch(next)
}

exports.getEndpoints = (req, res, next) => {
res.status(200).send(endpoints)

}

exports.getUsers = (req, res, next) => {
retrieveUsers()
.then((users) => {
  res.status(200).send({users: users})
})
  .catch(next)
}
