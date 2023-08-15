const fs = require("fs/promises");

exports.selectEndpoints = () => {
  return fs.readFile(
    `$(__dirname)/../endpoints.js`,
    "utf-8"
  );
};