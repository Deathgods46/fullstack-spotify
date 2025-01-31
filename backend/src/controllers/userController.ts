import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { Request, Response } from 'express';

interface MyJwtPayload extends JwtPayload {
  id: string;
}

export const getAllUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(200).json({ message: 'User not found', success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(200).json({ message: 'Invalid password', success: false });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '1h' },
    );

    res.json({
      message: 'Login successful',
      data: {
        user: { username: user.username, email: user.email, authToken: token },
      },
      success: true,
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof TokenExpiredError) {
      return res
        .status(201)
        .json({
          success: false,
          message: 'Token has expired, please login again',
        });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: 'Email already in use', success: false });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(200).json({ message: 'Username already in use', success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '1h' },
    );

    res
      .status(201)
      .json({ message: 'User registered successfully', success: true, data: { username: newUser.username, email: newUser.email, authToken: token } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const getUserByToken = async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  try {
    const token = authorization!.split(' ')[1];
    const decoded = jwt.verify(
      token!,
      process.env.JWT_SECRET_KEY!,
    ) as MyJwtPayload;
    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }
    res.status(200).json({
      message: 'User fetched successfully',
      success: true,
      data: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(201).json({ message: 'Invalid or expired token', success: false });
  }
};
