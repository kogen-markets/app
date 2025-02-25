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

// ✅ Proper CORS Middleware Configuration (Avoids duplicate headers)
app.use(
  cors({
    origin: "https://admin.kogen.markets",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Remove redundant custom CORS headers (Handled by cors middleware)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const db = config.db_url;
mongoose
  .connect(db, {
    connectTimeoutMS: 30000, // Increase timeout to 30 seconds
  })
  .then(() => {
    console.log("MongoDB connected");
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

exports.handler = async (event, context) => {
  console.log("Incoming event:", JSON.stringify(event, null, 2));

  const headers = {
    "Access-Control-Allow-Origin": "https://admin.kogen.markets",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  // ✅ Handle OPTIONS Preflight Requests (Handled in one place)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    // ✅ Ensure API Gateway event format for AWS Lambda
    const response = await awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;

    return response;
  } catch (error) {
    console.error("Lambda Error:", error);

    return {
      statusCode: 500,
      headers, // ✅ Include CORS headers even in errors
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
