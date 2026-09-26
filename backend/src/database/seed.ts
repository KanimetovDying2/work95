import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schemas/user.schema';
import { Cocktail } from '../cocktails/schemas/cocktail.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const cocktailModel = app.get<Model<Cocktail>>(getModelToken(Cocktail.name));

  console.log('Cleaning database...');

  await userModel.deleteMany({});
  await cocktailModel.deleteMany({});

  console.log('Creating users...');

  const password = await bcrypt.hash('123456', 10);

  const admin = await userModel.create({
    username: 'admin',
    displayName: 'System Admin',
    email: 'admin@cocktails.com',
    password,
    avatar: '/uploads/default-avatar.png',
    role: 'admin',
  });

  const user = await userModel.create({
    username: 'alex',
    displayName: 'Alex Drinker',
    email: 'user@cocktails.com',
    password,
    avatar: '/uploads/default-avatar.png',
    role: 'user',
  });

  console.log('🍹 Creating cocktails...');

  await cocktailModel.create([
    {
      user: user._id,
      title: 'Classic Mojito',
      image: '/uploads/mojito-placeholder.png',
      recipe:
        'Muddle mint leaves with sugar and lime juice. Add rum and top with soda.',
      isPublished: true,
      ingredients: [
        {
          name: 'White Rum',
          amount: '50ml',
        },
        {
          name: 'Lime Juice',
          amount: '25ml',
        },
        {
          name: 'Sugar',
          amount: '2 tsp',
        },
        {
          name: 'Mint',
          amount: '10 leaves',
        },
      ],
    },

    {
      user: user._id,
      title: 'Spicy Margarita',
      image: '/uploads/margarita-placeholder.png',
      recipe: 'Shake tequila, lime juice and spicy syrup with ice.',
      isPublished: false,
      ingredients: [
        {
          name: 'Tequila',
          amount: '60ml',
        },
        {
          name: 'Triple Sec',
          amount: '20ml',
        },
        {
          name: 'Lime Juice',
          amount: '30ml',
        },
        {
          name: 'Jalapeno',
          amount: '2 slices',
        },
      ],
    },
  ]);

  console.log('Seed completed');
  console.log('');
  console.log('Admin:');
  console.log('admin@cocktails.com / 123456');
  console.log('');
  console.log('User:');
  console.log('user@cocktails.com / 123456');

  await app.close();
}

bootstrap();
