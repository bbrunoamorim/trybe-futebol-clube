import { ModelStatic } from 'sequelize';
import IUserService from '../interfaces/ILoginService';
import User from '../../database/models/UserModel';
import IToken from '../interfaces/IToken';
import JwtToken from '../../services/jwt';
import IUser from '../interfaces/IUser';

export default class UserService implements IUserService {
  protected model: ModelStatic<User> = User;
  private _jwt: JwtToken = new JwtToken();

  async login(user: IUser): Promise<IToken> {
    const { email } = user;

    const token = this._jwt.createToken({ email });

    return { token };
  }
}
