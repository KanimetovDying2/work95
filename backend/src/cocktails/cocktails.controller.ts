import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RateCocktailDto } from './dto/rate.cocktail.dto';
import { CocktailsService } from './cocktails.service';
import { CreateCocktailDto } from './dto/create.cocktail.dto';
import type { JwtPayload } from '../users/interfaces/jwt.payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.config';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Controller('cocktails')
export class CocktailsController {
  constructor(private readonly cocktailsService: CocktailsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async create(
    @Req() req: RequestWithUser,
    @Body() createCocktailDto: CreateCocktailDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file
      ? `/uploads/${file.filename}`
      : createCocktailDto.image;

    const cocktail = await this.cocktailsService.create(
      { ...createCocktailDto, image: imagePath },
      req.user.userId,
    );
    return {
      message: 'Your cocktails is now waiting for publish by moderators',
      cocktail,
    };
  }

  @Get()
  async findAllPublic() {
    return this.cocktailsService.findAllPublic();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async findMy(@Req() req: RequestWithUser) {
    return this.cocktailsService.findByUser(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/all')
  async findAllAdmin(@Req() req: RequestWithUser) {
    return this.cocktailsService.findAllAdmin(req.user.role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cocktailsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/publish')
  async publish(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.cocktailsService.publish(id, req.user.role);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.cocktailsService.remove(id, req.user.userId, req.user.role);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/rating')
  async rate(
    @Param('id') id: string,
    @Body() rateCocktailDto: RateCocktailDto,
    @Req() req: RequestWithUser,
  ) {
    return this.cocktailsService.rateCocktail(
      id,
      req.user.userId,
      rateCocktailDto.value,
    );
  }
}
