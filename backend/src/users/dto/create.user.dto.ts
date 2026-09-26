import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  displayName: string;

  @IsEmail({}, { message: 'Incorrect format for email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be more than 6 symbols' })
  password?: string;

  @IsString()
  @IsOptional()
  avatar?: string; 

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  googleId?: string;
}