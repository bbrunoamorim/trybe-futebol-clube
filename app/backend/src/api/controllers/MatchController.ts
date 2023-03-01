import { Request, Response } from 'express';
import IMatchService from '../interfaces/IMatchService';

export default class MatchController {
  private _service: IMatchService;

  constructor(service: IMatchService) {
    this._service = service;
  }

  async findAll(_req: Request, res: Response) {
    const result = await this._service.findAll();

    return res.status(200).json(result);
  }
}
