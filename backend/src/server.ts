import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { docClient } from "./config/dynamoDB";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import { Redshift } from "aws-sdk";

import contactRoute from "./routes/contact"; // Import the send-email route
import workoutsRoute from "./routes/workouts";
import workoutPlanRoute from "./routes/workoutPlan";
import planRoute from "./routes/plan";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json()); // Middleware to parse JSON request bodies

// Test Route: Check if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send("Test Server is running! ");
});

// Sample API Endpoint
app.get("/dynamodb-data", async (req: Request, res: Response) => {
  try {
    const command = new ScanCommand({ TableName: process.env.DYNAMODB_TABLE! });
    const response = await docClient.send(command);
    res.json(response.Items); // Return the fetched items
  } catch (error) {
    console.error("Error fetching data from DynamoDB:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// See all plans from WorkoutPlans table
app.get("/dynamodb-plans", async (req: Request, res: Response) => {
  try {
    const command = new ScanCommand({ TableName: process.env.DYNAMODB_TABLE_PLANS! });
    const response = await docClient.send(command);
    res.json(response.Items); // Return the fetched items
  } catch (error) {
    console.error("Error fetching data from DynamoDB:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.use("/workout", workoutsRoute);

app.use("/api/workoutPlan", workoutPlanRoute);

// Send Email Route
app.use("/contact", contactRoute); // Mount the contact route

app.use('/plan', planRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Test Server is running on http://localhost:${PORT}`);
});
