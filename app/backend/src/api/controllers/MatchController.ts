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
}
