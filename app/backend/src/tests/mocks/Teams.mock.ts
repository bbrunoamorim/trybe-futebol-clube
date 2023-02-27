import Team from '../../database/models/TeamModel';

const teamsMock: Team[] = [
  {
    "id": 1,
    "teamName": "Avaí/Kindermann"
  },
  {
    "id": 2,
    "teamName": "Bahia"
  },
  {
    "id": 3,
    "teamName": "Botafogo"
  }
] as Team[];

const teamMock: Team = {
  id: 5,
  teamName: 'Cruzeiro'
} as Team;

export {
  teamsMock,
  teamMock
};
