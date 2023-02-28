import { Request, Response } from 'express';
import ILoginService from '../interfaces/ILoginService';

export default class LoginController {
  private _service: ILoginService;

  constructor(service: ILoginService) {
    this._service = service;
  }

  async login(req: Request, res: Response) {
    const result = await this._service.login(req.body);

    return res.status(200).json(result);
  }
}
