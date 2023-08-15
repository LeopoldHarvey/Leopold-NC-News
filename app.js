const express = require("express");
const { getTopics } = require("./controllers/topic.controller");
const {getArticleById} = require('./controllers/articles.controller')
const { handleErrorBadUrl,
  handleSequlErrors,
  handleCustomErrors,
} = require("./controllers/error.controller");


const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.use(handleSequlErrors);
app.use(handleCustomErrors);

app.get("*", handleErrorBadUrl);
exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
module.exports = { app };