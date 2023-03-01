import { Request, Response } from 'express';
import ILoginService from '../interfaces/ILoginService';

export default class LoginController {
  private _service: ILoginService;

  constructor(service: ILoginService) {
    this._service = service;
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await this._service.login(email, password);

    if (!result) return res.status(401).json({ message: 'Invalid email or password' });

    return res.status(200).json(result);
  }
}
