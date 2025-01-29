import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
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
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET_KEY || 'S0M3_$a|\/|p|_3'!,
      { expiresIn: '1h' },
    );

    res.json({ message: 'Login successful',data : {user: {username: user.username, email: user.email, authToken: token}} , success: true });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser });
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
      process.env.JWT_SECRET_KEY || 'S0M3_$a|\/|p|_3',
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
      }
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
