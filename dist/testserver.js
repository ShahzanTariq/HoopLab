"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
// 🏀 Test Route: Check if the server is running
app.get("/", (req, res) => {
    res.send("Test Server is running! 🏀");
});
// 🏀 Sample API Endpoint
app.get("/test", (req, res) => {
    res.json({ message: "This is a test response from the server!" });
});
// Start the server
app.listen(PORT, () => {
    console.log(`✅ Test Server is running on http://localhost:${PORT}`);
});
