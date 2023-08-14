const express = require("express");
const { getTopics } = require("./controllers/topic.controller");
const { handleErrorBadUrl} = require("./controllers/error.controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("*", handleErrorBadUrl)

module.exports = { app };