// src/index.ts

import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB

//https://medium.com/@chiragmehta900/how-to-connect-mongodb-atlas-with-node-js-typescript-123eeadd3d5c
mongoose.connect('mongodb://localhost:27017/creator-tools-directory')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// User model
interface User {
  username: string;
  email: string;
  password: string;
}

// Dummy user data (replace with MongoDB interactions)
const users: User[] = [];

// Middleware
app.use(express.json());

// Routes
app.post('/api/register', async (req: Request, res: Response) => {
  const { username, email, password }: User = req.body;

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user to DB (replace with MongoDB interactions)
  users.push({ username, email, password: hashedPassword });

  return res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/login', async (req: Request, res: Response) => {
  const { email, password }: User = req.body;

  // Find user by email
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ email: user.email }, 'your-secret-key');
  return res.status(200).json({ token });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
