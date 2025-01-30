import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

// Extend the Express Request interface to include the 'user' field
declare global {
  namespace Express {
    interface Request {
      token?: string | JwtPayload; // Or a more specific type depending on your decoded token structure
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    // Send response and immediately exit the middleware
    return res.status(401).json({ message: 'Authentication required' });
  }
  const decoded = verifyToken(token);

  if (!decoded) {
    // Send response and immediately exit the middleware
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.token = decoded; // Attach decoded user data to the request object
  next(); // Proceed to the next middleware or route handler
};
