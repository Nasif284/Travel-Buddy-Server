export interface EditOnboardingProfileRequestDTO {
  userId: string;
  about: string;
  dateOfBirth: Date;
  nationality: string;
  state: string;
  city: string;
  gender: string;
  travelSkills: string[];
  languages: string[];
}
