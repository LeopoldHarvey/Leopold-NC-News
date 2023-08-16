const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  let baseSQLString = `SELECT * FROM articles WHERE article_id = $1`;
 

  return db.query(baseSQLString, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Article id does not exist",
      });
    }
    return rows[0];
  });
};

exports.selectArticles = () => {
  return db.query(`
      SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::INT AS comment_count
      FROM articles
               LEFT JOIN comments on articles.article_id = comments.article_id
      GROUP BY articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, article_img_url
  `).then(({rows}) => {
      return rows
  })
}