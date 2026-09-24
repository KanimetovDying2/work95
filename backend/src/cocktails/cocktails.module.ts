import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cocktail, CocktailSchema } from './schemas/cocktail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Cocktail.name, schema: CocktailSchema }]),
  ],
  exports: [MongooseModule],
})
export class CocktailsModule {}