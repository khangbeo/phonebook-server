const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const morgan = require("morgan");
const middleware = require("./utils/middleware");
const personRouter = require("./controllers/personController");
// const crypto = require("crypto");
// const cors = require("cors");

const url = config.MONGODB_URI;
const app = express();

logger.info("connecting to", url);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

morgan.token("data", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.use(express.static("dist"));
app.use(express.json());

app.use("/api/persons", personRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
