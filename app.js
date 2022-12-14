const express = require("express");
const app = express();
const { config } = require("dotenv");
config();
const mongoose = require("mongoose");
const connectToDB = require("./connect");
const router = require("./Routes/router");
mongoose.set("strictQuery", false);

app.use("/api/v1/products",router);

const PORT = 4000;
const start = async () => {
  try {
    await connectToDB(process.env.MONGO_URI);
    app.listen(4000, () => {
      console.log(`Server listening on port ${PORT}...`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
