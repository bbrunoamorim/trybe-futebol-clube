import 'dotenv/config';
import { ModelStatic } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import ILoginService from '../interfaces/ILoginService';
import User from '../../database/models/UserModel';
import IToken from '../interfaces/IToken';
import IPayload from '../interfaces/IPayload';
import IRole from '../interfaces/IRole';

const secret = process.env.JWT_SECRET || 'jwt_secret';

export default class LoginService implements ILoginService {
  protected model: ModelStatic<User> = User;

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

    const token = jwt.sign({ email, role: userToLogin.role }, secret);

    return { token };
  }

  async getRole(authorization: string): Promise<IRole | null> {
    const decodedToken = jwt.verify(authorization, secret) as IPayload;

    const user = await this.model.findOne({
      where: { email: decodedToken.email },
    });

    if (!user) return null;

    return { role: decodedToken.role };
  }
}
