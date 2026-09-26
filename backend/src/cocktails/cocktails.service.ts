import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cocktail } from './schemas/cocktail.schema';
import { CreateCocktailDto } from './dto/create.cocktail.dto';

@Injectable()
export class CocktailsService {
  constructor(
    @InjectModel(Cocktail.name) private cocktailModel: Model<Cocktail>,
  ) {}

  private async executeQuery(
    filter: Record<string, any> = {},
  ): Promise<Cocktail[]> {
    return this.cocktailModel
      .find(filter)
      .populate('user', 'displayName avatar')
      .lean()
      .exec() as unknown as Cocktail[];
  }

  async create(
    createCocktailDto: CreateCocktailDto,
    userId: string,
  ): Promise<Cocktail> {
    const newCocktail = new this.cocktailModel({
      ...createCocktailDto,
      user: userId,
      isPublished: false,
    });
    return newCocktail.save();
  }

  async findAllPublic(): Promise<Cocktail[]> {
    return this.executeQuery({ isPublished: true });
  }

  async findByUser(userId: string): Promise<Cocktail[]> {
    return this.executeQuery({ user: new Types.ObjectId(userId) });
  }

  async findAllAdmin(userRole: string): Promise<Cocktail[]> {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admins can access this resource');
    }

    return this.executeQuery({});
  }

  async publish(id: string, userRole: string): Promise<Cocktail> {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admins can publish cocktails');
    }
    const cocktail = await this.cocktailModel.findById(id);

    if (!cocktail) {
      throw new NotFoundException('Cocktail not found');
    }

    cocktail.isPublished = true;
    return cocktail.save();
  }

  async remove(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<{ message: string }> {
    const cocktail = await this.cocktailModel.findById(id);
    if (!cocktail) {
      throw new NotFoundException('Cocktail not found');
    }

    if (userRole !== 'admin' && cocktail.user.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this cocktail',
      );
    }

    await this.cocktailModel.findByIdAndDelete(id);
    return { message: 'Cocktail deleted successfully' };
  }
}
