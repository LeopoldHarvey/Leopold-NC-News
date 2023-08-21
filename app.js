const express = require("express");
const { getTopics } = require("./controllers/topic.controller");
const {
  handleErrorBadUrl,
  handleSequlErrors,
  handleCustomErrors,
} = require("./controllers/error.controller");
const { getUsers } = require("./controllers/user.controller");
const {
  getArticleById,
  getArticles,
  getArticleComments,
  postCommentbyArticleId,
  patchArticleById,
} = require("./controllers/articles.controller");
const { getEndpoints } = require("./controllers/endpoint.controller");
const {
  getCommentById,
  deleteCommentById,
} = require("./controllers/comments.controller");

const app = express();
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postCommentbyArticleId);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/comments/:comment_id", getCommentById);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api/users", getUsers);
app.use(handleSequlErrors);
app.use(handleCustomErrors);

app.use((request, response) => {
  response.status(404).send({ msg: "Invalid url" });
});
app.use("*", handleErrorBadUrl);

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = { app };
