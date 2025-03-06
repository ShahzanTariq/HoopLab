import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5000;

// Initialize DynamoDB Client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION, // e.g., "us-east-1"
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient); 


// 🏀 Test Route: Check if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send("Test Server is running! 🏀");
});

// 🏀 Sample API Endpoint
app.get("/dynamodb-data", async (req: Request, res: Response) => {
  try {
    const command = new ScanCommand({ TableName: process.env.DYNAMODB_TABLE! });
    const response = await docClient.send(command);
    res.json(response.Items); // Return the fetched items
  } catch (error) {
    console.error("❌ Error fetching data from DynamoDB:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Test Server is running on http://localhost:${PORT}`);
});
