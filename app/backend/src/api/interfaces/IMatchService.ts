import IMatch from './IMatch';

export default interface IMatchService {
  findAll(): Promise<IMatch[]>,
  finishMatch(id: number): Promise<void>,
  updateMatch(id: number, homeGoals: number, awayGoals: number): Promise<void>,
  create(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number): Promise<IMatch>
}
