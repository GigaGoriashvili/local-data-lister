import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON body parsing

app.get('/', (req, res) => {
  res.send('Local Data Lister API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});