import Match from '../../database/models/MatchModel';

export default interface IMatchService {
  findAll(): Promise<Match[]>
}
