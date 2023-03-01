import { Request, Response, Router } from 'express';
import LoginService from '../services/LoginService';
import LoginController from '../controllers/LoginController';
import loginMiddleware from '../middlewares/LoginMiddleware';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const loginRouter = Router();
const loginService = new LoginService();
const loginController = new LoginController(loginService);

loginRouter.post(
  '/login',
  loginMiddleware.checkLoginFields,
  (req: Request, res: Response) => loginController.login(req, res),
);

loginRouter.get(
  '/login/role',
  AuthMiddleware.verifyToken,
  (req: Request, res: Response) => loginController.getRole(req, res),
);

export default loginRouter;
