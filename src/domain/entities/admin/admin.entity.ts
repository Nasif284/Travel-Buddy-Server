export interface AdminRole {
  roleId: string;
  name: string;
  description?: string | null;
}

export interface AdminProps {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  accountStatusCode: string;
  avatarUrl?: string | null;
  lastActiveAt?: Date | null;
  createdBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: AdminRole;
}

export class Admin {
  private readonly _id: string;
  private _fullName: string;
  private _email: string;
  private _passwordHash: string;
  private _accountStatusCode: string;
  private _avatarUrl?: string | null;
  private _lastActiveAt?: Date | null;
  private _createdBy?: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _role: AdminRole;

  constructor(props: AdminProps) {
    this._id = props.id;
    this._fullName = props.fullName;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._accountStatusCode = props.accountStatusCode;
    this._avatarUrl = props.avatarUrl ?? null;
    this._lastActiveAt = props.lastActiveAt ?? null;
    this._createdBy = props.createdBy ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._role = props.role;
  }

  get id(): string {
    return this._id;
  }

  get fullName(): string {
    return this._fullName;
  }

  get email(): string {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get accountStatusCode(): string {
    return this._accountStatusCode;
  }

  get avatarUrl(): string | null | undefined {
    return this._avatarUrl;
  }

  get lastActiveAt(): Date | null | undefined {
    return this._lastActiveAt;
  }

  get createdBy(): string | null | undefined {
    return this._createdBy;
  }

  get role(): AdminRole {
    return this._role;
  }
}
