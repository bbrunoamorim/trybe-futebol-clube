import { Request, Response } from 'express';
import IMatch from '../interfaces/IMatch';
import IMatchService from '../interfaces/IMatchService';
import ITeam from '../interfaces/ITeam';
import ITeamService from '../interfaces/ITeamService';

export default class LeaderboardController {
  private _matchesService: IMatchService;
  private _teamsService: ITeamService;

  constructor(matchService: IMatchService, teamService: ITeamService) {
    this._matchesService = matchService;
    this._teamsService = teamService;
  }

  private static countTotalMatches(id: number, matches: IMatch[]): number {
    let count = 0;

    matches.forEach((match) => {
      if (match.homeTeamId === id || match.awayTeamId === id) count += 1;
    });

    return count;
  }

  private static countGoalsHome(id: number, matches: IMatch[]): number {
    let count = 0;

    matches.forEach((match) => {
      if (match.homeTeamId === id) count += match.homeTeamGoals;
      if (match.awayTeamId === id) count += match.awayTeamGoals;
    });

    return count;
  }

  private static countGoalsAway(id: number, matches: IMatch[]): number {
    let count = 0;

    matches.forEach((match) => {
      if (match.homeTeamId === id) count += match.awayTeamGoals;
      if (match.awayTeamId === id) count += match.homeTeamGoals;
    });

    return count;
  }

  private static countTotalLosses(id: number, matches: IMatch[]): number {
    let count = 0;

    matches.forEach((match) => {
      if (match.homeTeamId === id && match.homeTeamGoals < match.awayTeamGoals) count += 1;
      if (match.awayTeamId === id && match.awayTeamGoals < match.homeTeamGoals) count += 1;
    });

    return count;
  }

  private static countWinsAndPoints(id: number, matches: IMatch[]): number[] {
    let wins = 0;
    let points = 0;

    matches.forEach((match) => {
      if (match.homeTeamId === id && match.homeTeamGoals > match.awayTeamGoals) {
        wins += 1;
        points += 3;
      }
      if (match.awayTeamId === id && match.awayTeamGoals > match.homeTeamGoals) {
        wins += 1;
        points += 3;
      }
    });

    return [wins, points];
  }

  static getHomeStats(teams: ITeam[], matches: IMatch[]) {
    const result = teams.map(({ id, teamName }) => {
      const homeTeamMatches = matches.filter(({ homeTeamId }) => homeTeamId === id);
      const totalDraws = LeaderboardController.countTotalMatches(id as number, homeTeamMatches)
        - LeaderboardController.countWinsAndPoints(id as number, homeTeamMatches)[0]
        - LeaderboardController.countTotalLosses(id as number, homeTeamMatches);
      return {
        name: teamName,
        totalPoints: LeaderboardController
          .countWinsAndPoints(id as number, homeTeamMatches)[1] + totalDraws,
        totalGames: LeaderboardController.countTotalMatches(id as number, homeTeamMatches),
        totalVictories: LeaderboardController.countWinsAndPoints(id as number, homeTeamMatches)[0],
        totalDraws,
        totalLosses: LeaderboardController.countTotalLosses(id as number, homeTeamMatches),
        goalsFavor: LeaderboardController.countGoalsHome(id as number, homeTeamMatches),
        goalsOwn: LeaderboardController.countGoalsAway(id as number, homeTeamMatches),
      };
    });

    return result;
  }

  static getAwayStats(teams: ITeam[], matches: IMatch[]) {
    const result = teams.map(({ id, teamName }) => {
      const homeTeamMatches = matches.filter(({ awayTeamId }) => awayTeamId === id);
      const totalDraws = LeaderboardController.countTotalMatches(id as number, homeTeamMatches)
        - LeaderboardController.countWinsAndPoints(id as number, homeTeamMatches)[0]
        - LeaderboardController.countTotalLosses(id as number, homeTeamMatches);
      return {
        name: teamName,
        totalPoints: LeaderboardController
          .countWinsAndPoints(id as number, homeTeamMatches)[1] + totalDraws,
        totalGames: LeaderboardController.countTotalMatches(id as number, homeTeamMatches),
        totalVictories: LeaderboardController.countWinsAndPoints(id as number, homeTeamMatches)[0],
        totalDraws,
        totalLosses: LeaderboardController.countTotalLosses(id as number, homeTeamMatches),
        goalsFavor: LeaderboardController.countGoalsHome(id as number, homeTeamMatches),
        goalsOwn: LeaderboardController.countGoalsAway(id as number, homeTeamMatches),
      };
    });

    return result;
  }

  async getHomeLeaderboard(_req: Request, res: Response) {
    const matches = await this._matchesService.getFinishedMatches();
    const teams = await this._teamsService.findAll();
    const result = LeaderboardController.getHomeStats(teams, matches);

    return res.status(200).json(result);
  }

  async getAwayLeaderboard(_req: Request, res: Response) {
    const matches = await this._matchesService.getFinishedMatches();
    const teams = await this._teamsService.findAll();
    const result = LeaderboardController.getAwayStats(teams, matches);

    return res.status(200).json(result);
  }
}
