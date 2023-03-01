import IMatch from './IMatch';

export default interface IMatchService {
  findAll(): Promise<IMatch[]>,
  finishMatch(id: number): Promise<void>
}
