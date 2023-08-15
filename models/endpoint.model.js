const fs = require("fs/promises");

exports.selectEndpoints = () => {
  return fs.readFile(
    "/home/leopold-harvey/northcoders/backend/review/be-nc-news/endpoints.json",
    "utf-8"
  );
};