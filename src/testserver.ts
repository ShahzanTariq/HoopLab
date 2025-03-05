import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5000;

// 🏀 Test Route: Check if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send("Test Server is running! 🏀");
});

// 🏀 Sample API Endpoint
app.get("/test", (req: Request, res: Response) => {
  res.json({ message: "This is a test response from the server!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Test Server is running on http://localhost:${PORT}`);
});
