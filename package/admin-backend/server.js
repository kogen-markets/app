const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const env = require("dotenv");
const config = require("./config");
const awsServerlessExpress = require("aws-serverless-express");

env.config(); // Load environment variables from .env file

const UserRouter = require("./routes/UserRouter");
const TradeRouter = require("./routes/TradeRouter");

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const db = config.db_url;
mongoose
  .connect(db, {
    connectTimeoutMS: 30000, // Increase timeout to 30 seconds
  })
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// Body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));

// Passport initialize
app.use(passport.initialize());

// Define routes
app.use("/api/", UserRouter);
app.use("/api/trades", TradeRouter);

// Create server for AWS Lambda
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  return awsServerlessExpress.proxy(server, event, context);
};
