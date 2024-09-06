import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import Razorpay from "razorpay";
import cors from "cors";

dotenv.config();

console.log("Razorpay Key ID from ENV:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Key Secret from ENV:", process.env.RAZORPAY_KEY_SECRET);

let instance;
try {
  instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log("Razorpay initialized successfully.");
} catch (error) {
  console.error('Error initializing Razorpay:', error.message);
}

const app = express();

// using middlewares
app.use(express.json());
app.use(cors({
  origin: "https://e-learning-murex-seven.vercel.app/", // Replace with your actual Vercel frontend URL
  credentials: true
}));


const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/uploads", express.static("uploads"));

// importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";

// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});

export { instance }; // Exporting the Razorpay instance
