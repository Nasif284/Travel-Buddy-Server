export interface UpdateProfileRequestDTO {
  fullName?: string;
  bio?: string;
  isTraveling?: boolean;
  travelPersonalityCode?: string;
  interests?: string[];
  languages?: string[];
  skills?: string[];
}
