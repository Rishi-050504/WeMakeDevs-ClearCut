import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { logger } from '../utils/logger.js';
import { Secret, SignOptions } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      name,
    });

    // Generate token
    const token = jwt.sign(
      { userId: (user._id as string).toString(), email: user.email }, // Use .toString() on ObjectId
      JWT_SECRET as Secret, // Cast JWT_SECRET to the correct type
      { expiresIn: JWT_EXPIRES_IN } as SignOptions // Cast options object
    );

    logger.info('User registered successfully', { userId: user._id, email });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    logger.error('Registration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: (user._id as string).toString(), email: user.email }, // Use .toString() on ObjectId
      JWT_SECRET as Secret, // Cast JWT_SECRET to the correct type
      { expiresIn: JWT_EXPIRES_IN } as SignOptions // Cast options object
    );

    logger.info('User logged in', { userId: user._id, email });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    logger.error('Login failed:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const token = jwt.sign(
      { userId: (user._id as string).toString(), email: user.email }, // Use .toString() on ObjectId
      JWT_SECRET as Secret, // Cast JWT_SECRET to the correct type
      { expiresIn: JWT_EXPIRES_IN } as SignOptions // Cast options object
    );

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    logger.error('Token refresh failed:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
    });
  }
}

export async function logout(req: Request, res: Response) {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
}