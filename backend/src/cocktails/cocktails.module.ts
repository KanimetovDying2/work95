import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cocktail, CocktailSchema } from './schemas/cocktail.schema';
import { CocktailsService } from './cocktails.service';
import { CocktailsController } from './cocktails.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cocktail.name, schema: CocktailSchema },
    ]),
  ],
  controllers: [CocktailsController],
  providers: [CocktailsService],
  exports: [MongooseModule],
})
export class CocktailsModule {}