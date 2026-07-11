import { GoogleAuthResponseDTO } from '../../../../dtos/auth/user/responce/google-auth.dto';

export interface IGoogleAuth {
  execute(dto: { token: string }): Promise<GoogleAuthResponseDTO>;
}
