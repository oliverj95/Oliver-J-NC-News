const db = require("../db/connection");
const format = require("pg-format")


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

exports.selectArticles = (sort_by = "created_at", order_by = "DESC", topic) => {
  
  let queryStr = 
  `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes,
  COUNT(comments.body)::INT 
  AS comment_count FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id`

  if(topic) {
    queryStr += 
    ` WHERE topic = $1 
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${ order_by}`
    
    return db.query(queryStr, [topic])
    .then((result) => {
      console.log(result.rows)
       if (result.rows.length === 0) {
         return Promise.reject({status: 404, message: "Status code 404: topic not found"})
       }
        return result.rows
    })
}  
else { 
  return db.query(
    `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes,
    COUNT(comments.body)::INT AS comment_count FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order_by}`)
.then((result) => {
    // console.log(result.rows, "<<<< in the else block")
    return result.rows
}
)
}
}