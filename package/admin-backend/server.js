const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const env = require("dotenv");
const config = require("./config");
env.config(); // Load environment variables from .env file

const UserRouter = require("./routes/UserRouter");
const TradeRouter = require("./routes/TradeRouter");

const app = express();

app.use(cors());

app.use(express.json({ limit: '50mb' }));

// Increase limit for URL-encoded data (forms)
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const db = config.db_url;
mongoose
  .connect(db, {
    // useNewUrlParser: true, // from 6 or higher version of mongoose
    // useUnifiedTopology: true, // the same above
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

const PORT = process.env.MAIN_PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});