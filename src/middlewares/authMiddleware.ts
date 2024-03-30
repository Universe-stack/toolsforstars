import { Request, Response, NextFunction } from 'express';
import {IUser} from '../models/userModel'

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

export const isPublisher = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser; 
    if (req.isAuthenticated() && user.role === 'publisher') {
      return next();
    }
    res.status(403).json({ message: 'Forbidden' });
  };
  
  export const isSuperuser = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    if (req.isAuthenticated() && user.role === 'superuser') {
      return next();
    }
    res.status(403).json({ message: 'Forbidden' });
  };