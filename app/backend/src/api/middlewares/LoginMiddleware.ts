import { Request, Response, NextFunction } from 'express';

export default class loginMiddleware {
  public static checkLoginFields(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
    const emailCheck = emailRegex.test(email);

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    if (!emailCheck || password.length < 6) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return next();
  }
}
