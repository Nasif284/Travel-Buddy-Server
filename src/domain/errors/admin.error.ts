export class AdminNotFoundError extends Error {
  constructor(identifier?: string) {
    super(identifier ? `No Admin found: ${identifier}` : 'Admin not found.');
    this.name = 'AdminNotFoundError';
  }
}
