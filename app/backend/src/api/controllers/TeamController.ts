import { Request, Response } from 'express';
import ITeamService from '../interfaces/ITeamService';

export default class TeamController {
  private _service: ITeamService;

  constructor(service: ITeamService) {
    this._service = service;
  }

  async findAll(req: Request, res: Response) {
    const result = await this._service.findAll();
    return res.status(200).json(result);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;

    const result = await this._service.findById(Number(id));

    if (!result) return res.status(400).json({ message: 'ID do time não encontrado' });

    return res.status(200).json(result);
  }
}
