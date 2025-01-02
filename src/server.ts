import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server } from 'http';
import app from './app';

// To handle synchronous exceptions (optional - uncomment if needed)
process.on('uncaughtException', (err: Error) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 😋 Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });


// Replace the password placeholder in the DB connection string
// const DB = process.env.DATABASE!.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!);

// mongoose
//   .connect(DB)
//   .then(() => console.log('DB connection successful 😹'))
//   .catch((err: Error) => {
//     console.error('Error connecting to DB 🤲🏾:', err.message);
//     process.exit(1); // Exit if DB connection fails
//   });

const port = process.env.PORT || 3000;

const server: Server = app.listen(port, () => {
  console.log(`App running on port ${port} 🚀`);
});

// To handle asynchronous exceptions
process.on('unhandledRejection', (err: any) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 😋 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
