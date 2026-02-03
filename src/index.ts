import express from 'express';
import dotenv from 'dotenv';
import {createClient} from 'redis'
import connectDb from './config/db.js';
import notesRoute from './routes/noteRoute.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT as string;

app.use(express.json());


app.use('/api/v1',notesRoute)


export const redisClient = createClient({
  url: process.env.REDIS_URL as string,
})

redisClient.connect().then(() => {
  console.log("Connected to Redis");
}).catch((error) => {
  console.error("Failed to connect to Redis", error);
  process.exit(1);
});

app.listen(PORT, () => {
connectDb();
  console.log(`Server is running on http://localhost:${PORT}`);
});