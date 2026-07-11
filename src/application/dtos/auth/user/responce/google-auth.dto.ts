import { LoginResponseDTO } from './login.dto';

export interface GoogleAuthResponseDTO extends LoginResponseDTO {
  isNew: boolean;
}
