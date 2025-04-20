import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userroutes.js';
import recommendationroutes from './routes/recommendationsRoutes.js';
import courseRoutes from './routes/courseRouter.js';
import interactionRoutes from './routes/interactionRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/users', userRoutes);
app.use('/images',express.static('uploads/images'))
app.use('/api/courses', courseRoutes);
app.use('/api/interactions', interactionRoutes);

app.use('/api',recommendationroutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
