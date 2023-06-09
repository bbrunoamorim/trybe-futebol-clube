import { ModelStatic } from 'sequelize';
import ITeamService from '../interfaces/ITeamService';
import Team from '../../database/models/TeamModel';

export default class TeamService implements ITeamService {
  protected model: ModelStatic<Team> = Team;

  async findAll(): Promise<Team[]> {
    const teams = await this.model.findAll();
    return teams;
  }

  async findById(id: number): Promise<Team | null> {
    const team = await this.model.findByPk(id);

    return team;
  }
}
