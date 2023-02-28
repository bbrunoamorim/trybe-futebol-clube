import IToken from './IToken';
import IUser from './IUser';

export default interface ILoginService {
  login(user: IUser): Promise<IToken>
}
