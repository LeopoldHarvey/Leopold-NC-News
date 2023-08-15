const express = require("express");
const { getTopics } = require("./controllers/topic.controller");
const { handleErrorBadUrl} = require("./controllers/error.controller");
const { getEndpoints } = require("./controllers/endpoint.controller")

const app = express();

app.get("/api/topics", getTopics);

app.get('/api', getEndpoints)



app.get("*", handleErrorBadUrl)

module.exports = { app };
