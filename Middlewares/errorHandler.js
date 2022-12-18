const CustomAPIError = require("./customErrorClass");

const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomAPIError) {
    return res
      .status(404)
      .json({ status: error.statusCode, message: error.message });
  }
  return res.status(500).json({ error: error.name, message: error.message });
};

const notFound = (req, res) => {
  res.status(400).send("<h1>Page not found</h1>");
};

module.exports = { errorHandler, notFound };
