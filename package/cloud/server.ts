import express from "express";
import cors from "cors";
import { connectToDB } from "./utils/db";
import tradeRoutes from "./routes/tradeRoutes";
import authRoutes from "./routes/authRoutes"; // Import auth routes

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST",
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Connect to DB
connectToDB();

// Routes
app.use("/api/trades", tradeRoutes);
app.use("/api/auth", authRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
