import { ModelStatic } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import ILoginService from '../interfaces/ILoginService';
import User from '../../database/models/UserModel';
import IToken from '../interfaces/IToken';
import JwtToken from '../../services/jwt';

export default class LoginService implements ILoginService {
  protected model: ModelStatic<User> = User;
  private _jwt: JwtToken = new JwtToken();

  protected static encryptionCheck(password: string, dbPassword: string) {
    const validation = bcrypt.compareSync(password, dbPassword);
    return validation;
  }

  async login(email: string, password: string): Promise<IToken | null> {
    const userToLogin = await this.model.findOne({
      where: { email },
    });

    if (!userToLogin) return null;

    const passCheck = LoginService.encryptionCheck(password, userToLogin.password);

    if (!passCheck) return null;

    const token = this._jwt.createToken({ email });

    return { token };
  }
}
