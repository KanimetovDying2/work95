import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginDto } from './dto/user.login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exist.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, salt)
      : undefined;

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .select(`+password`)
      .exec();

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    const { password, ...result } = user.toObject();
    return {
      message: `Login successful`,
      accessToken,
      user: result,
    };
  }

  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async googleLogin(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google Token');
      }

      const { email, name, picture, sub: googleId } = payload;

      let user = await this.userModel.findOne({
        $or: [{ email }, { googleId }],
      });

      if (!user) {

        let baseUsername = email.split('@')[0];
        let username = baseUsername;
        let counter = 1;

        while (await this.userModel.findOne({ username })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        user = new this.userModel({
          email,
          username,
          displayName: name || username,
          avatar: picture || '/uploads/default-avatar.png',
          googleId,

        });
        await user.save();
      } else if (!user.googleId) {

        user.googleId = googleId;
        if (!user.avatar || user.avatar === '/uploads/default-avatar.png') {
          user.avatar = picture || user.avatar;
        }
        await user.save();
      }

      const jwtPayload = {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
      };
      const accessToken = this.jwtService.sign(jwtPayload);

      const { password, ...result } = user.toObject();
      return {
        message: 'Google login successful',
        accessToken,
        user: result,
      };
    } catch (error) {
      throw new UnauthorizedException('Google authentication failed');
    }
  }
}
