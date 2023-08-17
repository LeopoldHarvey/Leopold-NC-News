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
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url, count(comments) AS comment_count FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleComments = (param_id) => {
  return db.query(`
  SELECT article_id FROM articles
  WHERE article_id = $1
  `, [param_id]).then(({rows}) => {
    if (rows.length === 0) {
      return Promise.reject({status: 404, msg: "article does not exist"})
  }
  return db.query(`
      SELECT *
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC
  `, [param_id])
}).then(({rows})=> {
  return rows
})
}


exports.insertCommentByArticleId = (body, article_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [body.username, body.body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
  };

  exports.updateArticleVotesById = (body, article_id) => {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
        [body.inc_votes, article_id]
      )
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({
            status: 404,
            msg: "Article id does not exist",
          });
        }
                return rows[0];
      })
    }