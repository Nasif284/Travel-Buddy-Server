import 'reflect-metadata';
import { Register } from '../../../application/use-cases/auth/user';
import { TOKENS } from '../tokens';
import { container } from 'tsyringe';
import { EmailVerification } from '../../../application/use-cases/auth/user/verify-email.usecase';
import { LoginUseCase } from '../../../application/use-cases/auth/user/login.usecase';
import { ForgotPassword } from '../../../application/use-cases/auth/user/forgot-password.usecase';
import { ResetPassword } from '../../../application/use-cases/auth/user/reset-password.usecase';
import { RefreshToken } from '../../../application/use-cases/auth/user/refresh-tokem.usecase';
import { SendOtp } from '../../../application/use-cases/auth/user/send-otp.usecase';
import { Logout } from '../../../application/use-cases/auth/user/logout.usecase';
import { VerifyOtp } from '../../../application/use-cases/auth/user/otp-verify.usecase';
import { GoogleAuth } from '../../../application/use-cases/auth/user/google-auth.usecase';

export function registerUserAuthDependencies(): void {
  container.registerSingleton<Register>(TOKENS.IRegister, Register);
  container.registerSingleton<EmailVerification>(
    TOKENS.IVerifyEmail,
    EmailVerification,
  );
  container.registerSingleton<LoginUseCase>(TOKENS.ILogin, LoginUseCase);
  container.registerSingleton<ForgotPassword>(
    TOKENS.IForgotPassword,
    ForgotPassword,
  );
  container.registerSingleton<ResetPassword>(
    TOKENS.IResetPassword,
    ResetPassword,
  );
  container.registerSingleton<RefreshToken>(TOKENS.IRefreshToken, RefreshToken);
  container.registerSingleton<SendOtp>(TOKENS.ISendOtp, SendOtp);
  container.registerSingleton<Logout>(TOKENS.ILogout, Logout);
  container.registerSingleton<VerifyOtp>(TOKENS.IVerifyOtp, VerifyOtp);
  container.registerSingleton<GoogleAuth>(TOKENS.IGoogleAuth, GoogleAuth);
}
