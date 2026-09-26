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

  async findOne(id: string): Promise<Cocktail> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid cocktail ID format');
    }

    const cocktail = await this.cocktailModel
      .findById(id)
      .populate('user', 'displayName avatar')
      .lean()
      .exec();

    if (!cocktail) {
      throw new NotFoundException('Cocktail not found');
    }

    const ratings = (cocktail as any).ratings || [];
    const totalRatings = ratings.length;
    const sum = ratings.reduce((acc: number, curr: any) => acc + curr.value, 0);
    const averageRating =
      totalRatings > 0 ? Number((sum / totalRatings).toFixed(1)) : 0;

    return {
      ...cocktail,
      averageRating,
      totalRatings,
    } as unknown as Cocktail;
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

  async rateCocktail(
    cocktailId: string,
    userId: string,
    value: number,
  ): Promise<{ message: string; averageRating: number; totalRatings: number }> {
    const cocktail = await this.cocktailModel.findById(cocktailId);
    if (!cocktail) {
      throw new NotFoundException('Cocktail not found');
    }

    const existingRatingIndex = cocktail.ratings.findIndex(
      (r) => r.userId.toString() === userId,
    );

    if (existingRatingIndex > -1) {
      cocktail.ratings[existingRatingIndex].value = value;
    } else {
      cocktail.ratings.push({
        userId: new Types.ObjectId(userId),
        value,
      });
    }

    await cocktail.save();

    const totalRatings = cocktail.ratings.length;
    const sum = cocktail.ratings.reduce((acc, curr) => acc + curr.value, 0);
    const averageRating =
      totalRatings > 0 ? Number((sum / totalRatings).toFixed(1)) : 0;

    return {
      message: 'Rating submitted successfully',
      averageRating,
      totalRatings,
    };
  }
}
