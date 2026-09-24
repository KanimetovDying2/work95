export class CreateUserDto {
  username: string;
  displayName: string;
  email: string;
  password?: string;
  avatar?: string;
  role?: string;
  googleId?: string;
}
