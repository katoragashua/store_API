const AsyncWrapper = require("../Middlewares/asyncWrapper");
const Product = require("../Model/productSchema");
const CustomAPIError = require("../Middlewares/customErrorClass");

const getProducts = AsyncWrapper(async (req, res, next) => {
  const { name, company, featured, price, rating, sort, fields, numeric_filters } = req.query;
  const queryObj = {};
  if (name) {
    queryObj.name = { $regex: name, $options: "i" }; // "i" meaning ignore case sensitivity
  }
  if (company) {
    queryObj.company = company;
  }
  if (featured) {
    queryObj.featured = featured === "true" ? true : false; // A ternary operator is used since the bolean value for featured in req.query is a string
  }
  if (rating) {
    queryObj.rating = { $lte: Number(rating) };
  }
  if (featured) {
    queryObj.featured = featured === "true" ? true : false;
  }
  if (price) {
    queryObj.price = { $lte: Number(price) };
  }
  console.log(queryObj);

  if(numeric_filters) {
      const operatorMap = {
        "<": "$lt",
        "<=": "$lte",
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq"
      };

      const regEx = /\b(<|>|<=|=>|=)\b/g
      let filters = numeric_filters.replace(regEx, (match) => `-${operatorMap[match]}-`);
      const options = ["price", "rating"]
      filters = filters.split(",").forEach(filter => {
        const [field, operator, value] = filter.split("-");
        if(options.includes(field)){
          queryObj[field] = {[operator]: Number(value)};
        }
      })
      console.log(queryObj)
    }
    

  let results = Product.find(queryObj);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    results = Product.find(queryObj).sort(sortList);
  } // Optionally you can add an else condition to sort based on time product was created.
  // console.log(results);

  // This is used to return only requested data fields
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    results = Product.find(queryObj).select(fieldsList);
  }

  const per_page = Number(req.query.per_page) || 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * per_page;
  console.log(skip)
  results = Product.find(queryObj).skip(skip).limit(per_page);

  const products = await results;
  // console.log(products);
  res
    .status(200)
    .json({ status: "success", nbHits: products.length, products });
});

const getProductByID = AsyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const product = await Product.findOne({ _id: taskID });
  if (!product) {
    // throw new CustomAPIError(`There's no product with id ${taskID}`, 404) or
    return next(
      new CustomAPIError(`There's no product with id ${taskID}`, 404)
    );
  }
  return res.status(200).json({ status: "success", product: product });
});

module.exports = { getProducts, getProductByID };
