import { Request, Response, Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';
import MatchService from '../services/MatchService';
import TeamService from '../services/TeamService';

const leaderboardRouter = Router();
const matchService = new MatchService();
const teamService = new TeamService();
const leaderboardController = new LeaderboardController(matchService, teamService);

leaderboardRouter.get(
  '/leaderboard/home',
  (req: Request, res: Response) => leaderboardController.getHomeLeaderboard(req, res),
);
leaderboardRouter.get(
  '/leaderboard/away',
  (req: Request, res: Response) => leaderboardController.getAwayLeaderboard(req, res),
);

export default leaderboardRouter;
