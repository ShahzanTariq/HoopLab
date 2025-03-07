"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const dynamoDBClient = new client_dynamodb_1.DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
router.get('/workouts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
    };
    try {
        const command = new client_dynamodb_1.ScanCommand(params);
        const response = yield dynamoDBClient.send(command);
        res.json(response.Items); // Return the fetched items
    }
    catch (error) {
        console.error('❌ Error fetching data from DynamoDB:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}));
exports.default = router;
