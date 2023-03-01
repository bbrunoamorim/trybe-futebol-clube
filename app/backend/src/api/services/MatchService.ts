import { ModelStatic } from 'sequelize';
import IMatchService from '../interfaces/IMatchService';
import Match from '../../database/models/MatchModel';
import Team from '../../database/models/TeamModel';

export default class MatchService implements IMatchService {
  protected model: ModelStatic<Match> = Match;

  async findAll(): Promise<Match[]> {
    const matches = await this.model.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Team, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });

    return matches;
  }
}
