const AsyncWrapper = require("../Middlewares/asyncWrapper");
const Product = require("../Model/productSchema")

const getProducts = AsyncWrapper(
    async (req, res, next) => {
        const products = await Product.find({})
        res.status(200).json({ products})
    }
)

module.exports ={getProducts}