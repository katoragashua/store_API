const AsyncWrapper = require("../Middlewares/asyncWrapper");
const Product = require("../Model/productSchema");
const CustomAPIError = require("../Middlewares/customErrorClass");

const getProducts = AsyncWrapper(async (req, res, next) => {
  const { name, company, featured, price, rating, sort } = req.query;
  const queryObj = {};
  if (name) {
    queryObj.name = { $regex: name, $options: "i" }; // "i" meaning ignore case sensitivity
  }
  if (company) {
    queryObj.company = company;
  }
  if (featured) {
    queryObj.featured = featured === "true" ? true : false; // A ternary operator is used since true in req.query is a string
  }
  if (rating) {
    queryObj.rating = { $lte: Number(rating) };
  }
  if (featured) {
    queryObj.featured = featured === "true" ? true : false;
  }
  
  console.log(queryObj);
  let products = await Product.find(queryObj);
  res
    .status(200)
    .json({ status: "success", nbHits: products.length, products });
});

const getProductByID = AsyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const product = await Product.findOne({ _id: taskID });
  if (!product) {
    return next(
      new CustomAPIError(`There's no product with id ${taskID}`),
      404
    );
  }
  return res.status(200).json({ status: "success", product: product });
});

module.exports = { getProducts, getProductByID };
