import { Request, Response, Router } from 'express';
import LoginService from '../services/LoginService';
import LoginController from '../controllers/LoginController';
import loginMiddleware from '../middlewares/LoginMiddleware';

const loginRouter = Router();
const loginService = new LoginService();
const loginController = new LoginController(loginService);

loginRouter.post(
  '/login',
  loginMiddleware.checkLoginFields,
  (req: Request, res: Response) => loginController.login(req, res),
);

export default loginRouter;
