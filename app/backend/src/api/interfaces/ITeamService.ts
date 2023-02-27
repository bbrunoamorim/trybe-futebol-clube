import Team from '../../database/models/TeamModel';

export default interface ITeamService {
  findAll(): Promise<Team[]>,
  findById(id: number): Promise<Team>
}
