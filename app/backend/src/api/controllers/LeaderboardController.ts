import { Request, Response } from 'express';
import IMatch from '../interfaces/IMatch';
import IMatchService from '../interfaces/IMatchService';
import ITeam from '../interfaces/ITeam';
import ITeamService from '../interfaces/ITeamService';
import ILeaderboard from '../interfaces/ILeaderboard';

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

  private static countTotalDraws(id: number, matches: IMatch[]): number {
    let draws = 0;

    matches.forEach((match) => {
      if (match.homeTeamId === id && match.homeTeamGoals === match.awayTeamGoals) {
        draws += 1;
      }
      if (match.awayTeamId === id && match.awayTeamGoals === match.homeTeamGoals) {
        draws += 1;
      }
    });

    return draws;
  }

  private static countGoalBalance(id: number, matches: IMatch[]): number {
    const gp = this.countGoalsHome(id, matches);
    const gc = this.countGoalsAway(id, matches);

    return gp - gc;
  }

  private static totalPoints(id: number, matches: IMatch[]) {
    const winPoints = this.countWinsAndPoints(id, matches)[1];
    const drawPoints = this.countTotalDraws(id, matches);

    return winPoints + drawPoints;
  }

  private static calculateEfficiency(id: number, matches: IMatch[]) {
    const points = this.totalPoints(id, matches);
    const games = this.countTotalMatches(id, matches);

    return ((points / (games * 3)) * 100).toFixed(2);
  }

  private static sortBoard(board: ILeaderboard[]) {
    return board.sort((a, b) => (
      b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || b.goalsOwn - a.goalsOwn
    ));
  }

  private static getHomeStats(teams: ITeam[], matches: IMatch[]) {
    return teams.map(({ id, teamName }) => {
      const homeTeamMatches = matches.filter(({ homeTeamId }) => homeTeamId === id);
      return {
        name: teamName,
        totalPoints: LeaderboardController.totalPoints(id as number, homeTeamMatches),
        totalGames: LeaderboardController.countTotalMatches(id as number, homeTeamMatches),
        totalVictories: LeaderboardController.countWinsAndPoints(id as number, homeTeamMatches)[0],
        totalDraws: LeaderboardController.countTotalDraws(id as number, homeTeamMatches),
        totalLosses: LeaderboardController.countTotalLosses(id as number, homeTeamMatches),
        goalsFavor: LeaderboardController.countGoalsHome(id as number, homeTeamMatches),
        goalsOwn: LeaderboardController.countGoalsAway(id as number, homeTeamMatches),
        goalsBalance: LeaderboardController.countGoalBalance(id as number, homeTeamMatches),
        efficiency: LeaderboardController.calculateEfficiency(id as number, homeTeamMatches),
      };
    });
  }

  private static getAwayStats(teams: ITeam[], matches: IMatch[]) {
    return teams.map(({ id, teamName }) => {
      const awayTeamMatches = matches.filter(({ awayTeamId }) => awayTeamId === id);
      return {
        name: teamName,
        totalPoints: LeaderboardController.totalPoints(id as number, awayTeamMatches),
        totalGames: LeaderboardController.countTotalMatches(id as number, awayTeamMatches),
        totalVictories: LeaderboardController.countWinsAndPoints(id as number, awayTeamMatches)[0],
        totalDraws: LeaderboardController.countTotalDraws(id as number, awayTeamMatches),
        totalLosses: LeaderboardController.countTotalLosses(id as number, awayTeamMatches),
        goalsFavor: LeaderboardController.countGoalsHome(id as number, awayTeamMatches),
        goalsOwn: LeaderboardController.countGoalsAway(id as number, awayTeamMatches),
        goalsBalance: LeaderboardController.countGoalBalance(id as number, awayTeamMatches),
        efficiency: LeaderboardController.calculateEfficiency(id as number, awayTeamMatches),
      };
    });
  }

  async getHomeLeaderboard(_req: Request, res: Response) {
    const matches = await this._matchesService.getFinishedMatches();
    const teams = await this._teamsService.findAll();
    const result = LeaderboardController.getHomeStats(teams, matches);
    const sortedBoard = LeaderboardController.sortBoard(result);

    return res.status(200).json(sortedBoard);
  }

  async getAwayLeaderboard(_req: Request, res: Response) {
    const matches = await this._matchesService.getFinishedMatches();
    const teams = await this._teamsService.findAll();
    const result = LeaderboardController.getAwayStats(teams, matches);
    const sortedBoard = LeaderboardController.sortBoard(result);

    return res.status(200).json(sortedBoard);
  }
}
