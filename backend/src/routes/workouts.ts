import express, { Request, Response } from 'express';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

router.get('/workouts', async (req: Request, res: Response) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
  };

  try {
    const command = new ScanCommand(params);
    const response = await dynamoDBClient.send(command);
    console.log('✅ Successfully fetched data from DynamoDB:', response.Items);
    res.json(response.Items); // Return the fetched items
  } catch (error) {
    console.error('❌ Error fetching data from DynamoDB:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

export default router;