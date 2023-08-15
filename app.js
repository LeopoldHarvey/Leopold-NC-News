const express = require("express");
const { getTopics } = require("./controllers/topic.controller");
const { handleErrorBadUrl,
  handleSequlErrors,
  handleCustomErrors,
} = require("./controllers/error.controller");
const { getEndpoints } = require("./controllers/endpoint.controller")
const {getArticleById} = require('./controllers/articles.controller')
const app = express();
app.get('/api', getEndpoints)
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.use(handleSequlErrors);
app.use(handleCustomErrors);
app.use("*", handleErrorBadUrl)
exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};


module.exports = { app };