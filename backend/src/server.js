import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

// Database
import connectDb from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// Utilities & Error Handling
import ApiError from "./utils/ApiError.js";
import errorHandler from "./middleware/errorHandler.js";

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// 3. Rate Limiting (Prevents Brute Force Attacks)
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per window
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes.'
});
app.use('/api', limiter);

// Body Parsers
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// HTTP Request Logging (Only in Development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/records`, recordRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);


// Catch all undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDb();
        
        const server = app.listen(PORT, () => {
            console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });

        process.on('unhandledRejection', (err) => {
          console.error('UNHANDLED REJECTION! 💥 Shutting down...');
          console.error(err.name, err.message);
          server.close(() => {
            process.exit(1);
          });
        });

    } catch (error) {
        console.error(`❌ Server startup failed: ${error.message}`);
        process.exit(1);
    }
};

// Only start the server if we are NOT running tests
if (process.env.NODE_ENV !== 'test') {
    startServer();
}

export default app;