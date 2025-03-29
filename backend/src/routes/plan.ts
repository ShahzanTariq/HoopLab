import express ,{ Request, Response } from "express";

import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
const router = express.Router();

dotenv.config();

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION, // e.g., "us-east-1"
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const docClient = DynamoDBDocumentClient.from(dynamoClient); 

//Update workoutplan workout atttribute (by overwriting current workout so it doesnt add on)
router.put("/user/:userID/plan/:planID", async (req: Request<{planID: string, userID:string}, {}, { userId: string, planId: string, workouts: { workoutId: string, workoutName: string, sets: number, reps: number }[] }>
  , res: Response) => {
    
    try{
      const planID = req.params.planID;
      const userID = req.params.userID;
      const workouts = req.body.workouts; 
      

      const getParams = {
        TableName: process.env.DYNAMODB_TABLE_PLANS!,
        Key: { userID, planID },
      };
              
      const updatedWorkouts = workouts;

      const updateParams = {
        TableName: process.env.DYNAMODB_TABLE_PLANS!,
        Key: { userID, planID },
        UpdateExpression: "SET workouts = :workouts, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
            ":workouts": updatedWorkouts,
            ":updatedAt": new Date().toISOString()
        }
      }

      await docClient.send(new UpdateCommand(updateParams));
      res.status(200).json({ message: 'Workout plan updated' });

      } catch (error) {
        console.error('Error updating workout plan:', error);
        res.status(500).json({ message: 'Error adding workouts to plan' });
      }
  });

  //Find the workoutID and remove it and then overwrite
  router.delete("/user/:userID/plan/:planID/workout/:workoutID", async (req: Request<{ userID: string, planID: string, workoutID: string },{},{}>, res: Response) => {
        try {
            const { userID, planID, workoutID } = req.params;

            const getParams = {
                TableName: process.env.DYNAMODB_TABLE_PLANS!,
                Key: { userID, planID },
            };
            const { Item: plan } = await docClient.send(new GetCommand(getParams));

            if (!plan) {
                res.status(404).json({ message: "Workout plan not found" });
                return;
            }

            if (!plan.workouts || !Array.isArray(plan.workouts) || plan.workouts.length === 0) {
                // If workouts array doesn't exist or is empty, the workout to delete isn't there
                 res.status(404).json({ message: "Workout not found in this plan (no workouts exist)" });
                 return;
            }

            const workoutIndexToRemove = plan.workouts.findIndex((workout: any) => workout.workoutId === workoutID);

            if (workoutIndexToRemove === -1) {
                res.status(404).json({ message: `Workout with ID '${workoutID}' not found in this plan` });
                return;
            }

            const updateParams = {
                TableName: process.env.DYNAMODB_TABLE_PLANS!,
                Key: { userID, planID },
                UpdateExpression: `REMOVE workouts[${workoutIndexToRemove}] SET updatedAt = :updatedAt`,
                ExpressionAttributeValues: {
                    ":updatedAt": new Date().toISOString()
                }
            };

            await docClient.send(new UpdateCommand(updateParams));
            res.status(204).send();

        } catch (error) {
            console.error('Error deleting workout from plan:', error);
            res.status(500).json({ message: 'Error deleting workout from plan' });
        }
    }
);

  export default router;