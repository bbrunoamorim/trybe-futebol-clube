export default class IdNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IdNotFound';
    this.stack = '404';
  }
}
