import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import { Redshift } from "aws-sdk";
import contactRoute from "./routes/contact"; // Import the send-email route

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
// Initialize DynamoDB Client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION, // e.g., "us-east-1"
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient); 

app.use(cors());
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

app.get("/workouts", async (req: Request, res: Response) => {
  const command = new ScanCommand({ 
    TableName: process.env.DYNAMODB_TABLE!
   });
  try {
    
    const response = await docClient.send(command);
    res.json(response.Items); // Return the fetched items
  } catch (error) {
    console.error("Error fetching data from DynamoDB:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.post('/api/workoutPlan/create', async (req: Request<{}, {}, { userId: string, planName: string }>, res: Response) => {
  try {
    const userID = req.body.userId;
    const planName = req.body.planName;
    const planID = uuidv4();

    const params = {
      TableName: process.env.DYNAMODB_TABLE_PLANS!,
      Item: {
        userID,
        planID,
        planName,
        workouts: [], 
        updatedAt: new Date().toISOString(),
      },
    };

    await docClient.send(new PutCommand(params));

    res.status(201).json({ planID }); 
  } catch (error) {
    console.error('Error creating workout plan:', error);
    res.status(500).json({ message: 'Error creating workout plan' });
  }
});


app.post('/api/workoutPlan/addWorkouts', async (req: Request<{}, {}, { userId: string, planId: string, workouts: { workoutId: string, workoutName: string, sets: number, reps: number }[] }>
, res: Response) => {
  try {
    const userID = req.body.userId;
    const planID = req.body.planId;
    const workouts = req.body.workouts;

    if(!workouts || !Array.isArray(workouts) || workouts.some(workout => !workout.workoutId || !workout.sets || !workout.reps || !workout.workoutName)) {
      res.status(400).json({message: "Invalid workout data"});  
      return;
    }

    const getParams = {
      TableName: process.env.DYNAMODB_TABLE_PLANS!,
      Key: { userID, planID },
    };

    const existingPlan = await docClient.send(new GetCommand(getParams));

    if (!existingPlan.Item) {
      res.status(404).json({ message: 'Workout plan not found' });
      return;
    }
        
    const updatedWorkouts = [...existingPlan.Item.workouts, ...workouts];

    const updateParams = {
        TableName: process.env.DYNAMODB_TABLE_PLANS!,
        Key: { userID, planID },
        UpdateExpression: "SET workouts = :workouts, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
            ":workouts": updatedWorkouts,
            ":updatedAt": new Date().toISOString()
        }

    };


    await docClient.send(new UpdateCommand(updateParams));

    res.status(200).json({ message: 'Workouts added to plan' });
  } catch (error) {
    console.error('Error adding workouts to plan:', error);
    res.status(500).json({ message: 'Error adding workouts to plan' });
  }
});


//Get User's Plans
app.get('/api/workoutPlan/user/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try{
      const params = {
          TableName: process.env.DYNAMODB_TABLE_PLANS!,
          KeyConditionExpression: 'userID = :uid',
          ExpressionAttributeValues: {
                ':uid': userId,
          },
        };
      
      const result = await docClient.send(new QueryCommand(params)); //Use QueryCommand
      res.json(result.Items);

  }catch(error){
      console.error("Error fetching user plans", error);
      res.status(500).json({error: "Could not fetch plans"});
  }
});

// Send Email Route
app.use("/contact", contactRoute); // Mount the contact route

// Start the server
app.listen(PORT, () => {
  console.log(`Test Server is running on http://localhost:${PORT}`);
});
