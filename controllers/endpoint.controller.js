const endpoint = require(`../endpoints.json`);

exports.getEndpoints = (request, response, next) => {
  response.status(200).json({ endpoint });
};
