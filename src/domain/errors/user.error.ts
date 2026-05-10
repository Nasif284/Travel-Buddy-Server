export class UserNotFoundError extends Error {
  constructor(identifier?: string) {
    super(identifier ? `No user found: ${identifier}` : 'User not found.');
    this.name = 'UserNotFoundError';
  }
}
