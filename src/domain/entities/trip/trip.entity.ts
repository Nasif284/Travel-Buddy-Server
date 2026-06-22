import { TripStatus } from '../../enums/trip.constants';

export interface Destination {
  id: string;
  placeId: string;
  displayName: string;
  name: string;
  city: string | null;
  state: string | null;
  country: string;
  countryCode: string | null;
  latitude: number;
  longitude: number;
}
export interface TripMember {
  id: string;
  userId: string;
  roleCode: string;
  joinedAt: Date;
  leftAt: Date | null;
  isActive: boolean;
}
export interface TripInvite {
  id: string;
  invitedBy: string;
  invitedUserId: string | null;
  invitedEmail: string | null;
  message: string | null;
  statusCode: string;
  expiresAt: Date | null;
  respondedAt: Date | null;
  createdAt: Date;
}
export interface TripSettings {
  budget: number | null;
  currencyCode: string;
  maxMembers: number;
  travelStyleCode: null;
}

export class Trip {
  constructor(
    public readonly id: string,
    public name: string,
    public dateFrom: Date,
    public dateTo: Date,
    public budget: number | null,
    public notes: string | null,
    public coverPhotoUrl: string | null,
    public statusCode: string,
    public createdBy: string,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null,
    public destination: Destination,
    public settings: TripSettings,
    public members: TripMember[],
    public invites: TripInvite[],
  ) {}

  get durationDays(): number {
    const diff = this.dateTo.getTime() - this.dateFrom.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  isUpcoming(): boolean {
    return this.statusCode === TripStatus.UPCOMING;
  }

  isCompleted(): boolean {
    return this.statusCode === TripStatus.COMPLETED;
  }

  isCancelled(): boolean {
    return this.statusCode === TripStatus.CANCELLED;
  }

  canAcceptMembers(currentMembersCount: number): boolean {
    return currentMembersCount < this.settings.maxMembers;
  }

  validateDates(): void {
    if (this.dateFrom >= this.dateTo) {
      throw new Error('Trip end date must be after start date');
    }
  }

  softDelete(): void {
    this.deletedAt = new Date();
  }
}
