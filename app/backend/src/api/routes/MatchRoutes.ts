import { Request, Response, Router } from 'express';
import MatchController from '../controllers/MatchController';
import MatchService from '../services/MatchService';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const matchRouter = Router();
const matchService = new MatchService();
const matchController = new MatchController(matchService);

matchRouter.get('/matches', (req: Request, res: Response) => matchController.findAll(req, res));
matchRouter.patch(
  '/matches/:id/finish',
  AuthMiddleware.verifyToken,
  (req: Request, res: Response) => matchController.finishMatch(req, res),
);
matchRouter.patch(
  '/matches/:id',
  AuthMiddleware.verifyToken,
  (req: Request, res: Response) => matchController.updateMatch(req, res),
);

export default matchRouter;
