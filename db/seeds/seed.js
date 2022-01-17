const db = require("../connection");
// const allData = require("../data/test-data/index");
const format = require("pg-format")

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return db
    .query(`DROP TABLE IF EXISTS comments; `)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles; `);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users; `);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics; `);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics (
      slug TEXT UNIQUE NOT NULL PRIMARY KEY,
      description VARCHAR(100)

    );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
      username TEXT UNIQUE NOT NULL PRIMARY KEY,
      avatar_url TEXT NOT NULL,
      name VARCHAR(50)
    );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (

      article_id SERIAL PRIMARY KEY,
      title VARCHAR(100),
      body TEXT NOT NULL,
      votes INT NOT NULL,
      topic TEXT NOT NULL,
      FOREIGN KEY (topic) REFERENCES topics(slug),
      author TEXT NOT NULL,
      FOREIGN KEY (author) REFERENCES users(username),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

    );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
      
      comment_id SERIAL PRIMARY KEY,
      author TEXT NOT NULL,
      FOREIGN KEY (author) REFERENCES users(username),
      article_id INT NOT NULL,
      FOREIGN KEY (article_id) REFERENCES articles(article_id),
      votes INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      body TEXT NOT NULL
    );`);
    })
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description];
      });
      const insertFormattedTopics = format(
        `INSERT INTO topics 
      (slug, description) 
      VALUES %L RETURNING *;`, formattedTopics
      );
      return db.query(insertFormattedTopics)
    })
    .then(() => {
      const formattedUsers = userData.map((user) => {
        return [user.username, user.avatar_url, user.name]
      })
     const insertFormattedUsers = format(
        `INSERT INTO users
      (username, avatar_url, name)
      VALUES %L RETURNING *;`, formattedUsers
     );
     return db.query(insertFormattedUsers)
    })
    .then(() => {
      const formattedArticles = articleData.map((article) => {
        return [article.title, article.body, article.votes, article.topic, article.author, article.created_at]
      })
      const insertFormattedArticles = format(
        `INSERT INTO articles
        (title, body, votes, topic, author, created_at)
        VALUES %L RETURNING *;`, formattedArticles
      );
      return db.query(insertFormattedArticles)
    })
    .then(() => {
      const formattedComments = commentData.map((comment) => {
        return [comment.author, comment.article_id, comment.votes, comment.created_at, comment.body]
      })
      const insertFormattedComments = format(
        `INSERT INTO comments
        (author, article_id, votes, created_at, body)
        VALUES %L RETURNING *;`, formattedComments
      );
      return db.query(insertFormattedComments)
    })
};

module.exports = seed;
