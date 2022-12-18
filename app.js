const express = require("express");
const app = express();
const { config } = require("dotenv");
config();
const mongoose = require("mongoose");
const connectToDB = require("./connect");
const router = require("./Routes/router");
mongoose.set("strictQuery", false);
const {errorHandler, notFound} = require("./Middlewares/errorHandler")

app.get("/", (req, res) => {
  res.status(200).send(`
  <h1>Store API Home Page</h1>
  <a href="/api/v1/products">Link to API</a>
  `);
});

app.use("/api/v1/products", router);


app.use(errorHandler)
app.use(notFound)

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectToDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
