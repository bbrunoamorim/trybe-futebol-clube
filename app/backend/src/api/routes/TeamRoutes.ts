import { Request, Response, Router } from 'express';
import TeamService from '../services/TeamService';
import TeamController from '../controllers/TeamController';

const teamRouter = Router();
const teamService = new TeamService();
const teamController = new TeamController(teamService);

teamRouter.get('/teams', (req: Request, res: Response) => teamController.findAll(req, res));
teamRouter.get('/teams/:id', (req: Request, res: Response) => teamController.findById(req, res));

export default teamRouter;
