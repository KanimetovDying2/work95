import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginDto } from './dto/user.login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../cocktails/multer.config';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatarPath = file
      ? `/uploads/${file.filename}`
      : '/uploads/default-avatar.png';
    const user = await this.usersService.create({
      ...createUserDto,
      avatar: avatarPath,
    });
    const { password, ...result } = user.toObject();
    return result;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
