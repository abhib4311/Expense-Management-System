import express from 'express';
import cors from 'cors';
import { connectDB } from './DB/Database.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import transactionRoutes from './Routers/Transactions.js'; // Assuming these are your transaction routes
import userRoutes from './Routers/userRouter.js'; // Assuming these are your user routes

dotenv.config();

const { json, urlencoded } = bodyParser;
const app = express();

const port = process.env.PORT || 5000; // 5000 as a fallback


connectDB();


app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Security middleware (consider customizing helmet options for production)
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Logging middleware (use a more concise logging format in production)
app.use(morgan('dev')); // Change to 'combined' or 'common' for production

// Body parser middleware (use only the necessary parsers)
app.use(json()); // Parse JSON bodies
app.use(urlencoded({ extended: false })); // Parse URL-encoded bodies (if needed)

// Router usage
app.use('/api/v1', transactionRoutes);
app.use('/api/auth', userRoutes);

// Error handling middleware (consider using a more robust error handler)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).send('Something went wrong!'); // Send a generic error response
});

// --------------------------deployment------------------------------

app.get("/", (req, res) => {
  res.send("API is running..");
});
// Start the server (consider using a process manager like PM2 in production)
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
