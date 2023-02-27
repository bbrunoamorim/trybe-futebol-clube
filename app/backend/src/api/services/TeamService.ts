import { ModelStatic } from 'sequelize';
import ITeamService from '../interfaces/ITeamService';
import Team from '../../database/models/TeamModel';
import IdNotFoundError from '../errors/IdNotFoundError';
import ID_NOT_FOUND from '../errors/messages/IdNotFoundMessage';

export default class TeamService implements ITeamService {
  protected model: ModelStatic<Team> = Team;

  async findAll(): Promise<Team[]> {
    const teams = await this.model.findAll();
    return teams;
  }

  async findById(id: number): Promise<Team> {
    const team = await this.model.findByPk(id);
    if (!team) {
      throw new IdNotFoundError(ID_NOT_FOUND);
    }
    return team;
  }
}
