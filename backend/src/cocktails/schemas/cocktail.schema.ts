import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
class Ingredient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  amount: string;
}

@Schema({ _id: false })
class Rating {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  value: number;
}

@Schema({ timestamps: true })
export class Cocktail extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  recipe: string;

  @Prop({ required: true, default: false })
  isPublished: boolean;

  @Prop({ type: [Ingredient], required: true })
  ingredients: Ingredient[];

  @Prop({ type: [Rating], default: [] })
  ratings: Rating[];
}

export const CocktailSchema = SchemaFactory.createForClass(Cocktail);
