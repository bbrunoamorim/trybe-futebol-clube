import IRole from './IRole';
import IToken from './IToken';

export default interface ILoginService {
  login(email: string, password: string): Promise<IToken | null>,
  getRole(authorization: string | undefined): Promise<IRole | null>
}
