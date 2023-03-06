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

  static countTotalMatches(id: number, matches: IMatch[]): number {
    let count = 0;

    matches.forEach((match) => {
      if (match.homeTeamId === id || match.awayTeamId === id) count += 1;
    });

    return count;
  }

  static countGoalsHome(id: number, matches: IMatch[]): number {
    let count = 0;

    matches.forEach((match) => {
      if (match.homeTeamId === id) count += match.homeTeamGoals;
      if (match.awayTeamId === id) count += match.awayTeamGoals;
    });

    return count;
  }

  static countGoalsAway(id: number, matches: IMatch[]): number {
    let count = 0;

    matches.forEach((match) => {
      if (match.homeTeamId === id) count += match.awayTeamGoals;
      if (match.awayTeamId === id) count += match.homeTeamGoals;
    });

    return count;
  }

  static countTotalLosses(id: number, matches: IMatch[]): number {
    let count = 0;

    matches.forEach((match) => {
      if (match.homeTeamId === id && match.homeTeamGoals < match.awayTeamGoals) count += 1;
      if (match.awayTeamId === id && match.awayTeamGoals < match.homeTeamGoals) count += 1;
    });

    return count;
  }

  static countWinsAndPoints(id: number, matches: IMatch[]): number[] {
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

  static getAllStats(teams: ITeam[], matches: IMatch[]) {
    const result = teams.map(({ id, teamName }) => {
      const totalGames = LeaderboardController.countTotalMatches(id as number, matches);
      const totalWinsAndPoints = LeaderboardController.countWinsAndPoints(id as number, matches);
      const totalLosses = LeaderboardController.countTotalLosses(id as number, matches);
      const goalsFavor = LeaderboardController.countGoalsHome(id as number, matches);
      const goalsOwn = LeaderboardController.countGoalsAway(id as number, matches);

      return {
        name: teamName,
        totalPoints: totalWinsAndPoints[1] + (totalGames - totalWinsAndPoints[0] - totalLosses),
        totalGames,
        totalVictories: totalWinsAndPoints[0],
        totalDraws: totalGames - totalWinsAndPoints[0] - totalLosses,
        totalLosses,
        goalsFavor,
        goalsOwn,
      };
    });

    return result;
  }

  async getLeaderboard(_req: Request, res: Response) {
    const matches = await this._matchesService.getFinishedMatches();
    const teams = await this._teamsService.findAll();
    const result = LeaderboardController.getAllStats(teams, matches);

    return res.status(200).json(result);
  }
}
