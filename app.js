const express = require("express");
const { getTopics } = require("./controllers/topic.controller");
const { handleErrorBadUrl,
  handleSequlErrors,
  handleCustomErrors,
} = require("./controllers/error.controller");
const {getArticleById, getArticles, getArticleComments, postCommentbyArticleId,} = require("./controllers/articles.controller");
const { getEndpoints } = require("./controllers/endpoint.controller")

const app = express();
app.use(express.json());

app.get('/api', getEndpoints)
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get('/api/articles',getArticles)
app.get('/api/articles/:article_id/comments', getArticleComments)
app.post("/api/articles/:article_id/comments", postCommentbyArticleId);
app.use(handleSequlErrors);
app.use(handleCustomErrors);
app.use((request, response) => {
  response.status(404).send({ msg: "Invalid url" });
});
app.use("*", handleErrorBadUrl)


exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};


module.exports = { app };
