import { Request, Response } from 'express';
import IMatchService from '../interfaces/IMatchService';

export default class MatchController {
  private _service: IMatchService;

  constructor(service: IMatchService) {
    this._service = service;
  }

  async findAll(req: Request, res: Response) {
    const result = await this._service.findAll();
    const { inProgress } = req.query;

    if (inProgress) {
      const matches = result.filter((match) => match.inProgress.toString() === inProgress);
      return res.status(200).json(matches);
    }

    return res.status(200).json(result);
  }

  async finishMatch(req: Request, res: Response) {
    const { id } = req.params;

    await this._service.finishMatch(Number(id));

    return res.status(200).json({ message: 'Finished' });
  }

  async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    await this._service.updateMatch(Number(id), homeTeamGoals, awayTeamGoals);

    return res.status(200).json({ message: 'Match updated' });
  }

  async create(req: Request, res: Response) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;

    if (!await this._service.findById(homeTeamId) || !await this._service.findById(awayTeamId)) {
      return res.status(404).json({ message: 'There is no team with such id!' });
    }

    if (homeTeamId === awayTeamId) {
      return res
        .status(422).json({ message: 'It is not possible to create a match with two equal teams' });
    }

    const result = await this._service.create(
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
    );

    return res.status(201).json(result);
  }
}
