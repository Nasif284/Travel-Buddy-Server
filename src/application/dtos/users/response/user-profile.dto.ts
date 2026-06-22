export interface GetUserProfileResponseDTO {
  id: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  age: number | null;
  city: string | null;
  state: string | null;
  country: string | null;
  travelType: string | null;
  travelPersonality: string | null;
  isTraveling: boolean;
  interests: string[];
  skills: string[];
  languages: string[];
  createdAt: Date;
}
