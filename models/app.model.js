const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    return topics.rows;
  });
};

exports.selectArticlesById = (id) => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes,
    COUNT(comments.comment_id)::INT 
    AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id`,
      [id]
    )
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({
          status: 404,
          message: `No article found for article_id ${id}`,
        });
      }
      return result.rows[0];
    });
};

exports.updateById = (id, votes) => {
  return db
    .query(
      `UPDATE articles 
SET votes = votes + $1
WHERE article_id = $2
RETURNING *;`,
      [votes, id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectArticles = (sort_by = "created_at") => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes,
  COUNT(comments.comment_id)::INT 
  AS comment_count 
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY ${sort_by}`
    )
    .then((result) => {
      return result.rows;
    });
};
