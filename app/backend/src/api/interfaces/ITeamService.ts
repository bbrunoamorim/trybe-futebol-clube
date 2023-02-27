import Team from '../../database/models/TeamModel';

export default interface ITeamService {
  findAll(): Promise<Team[]>
}
