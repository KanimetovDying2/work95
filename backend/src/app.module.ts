import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CocktailsModule } from './cocktails/cocktails.module';
import { User, UserSchema } from './users/schemas/user.schema';
import { Cocktail, CocktailSchema } from './cocktails/schemas/cocktail.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGO_URI',
          'mongodb://localhost:27017/cocktails-db',
        ),
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Cocktail.name, schema: CocktailSchema },
    ]),

    UsersModule,
    CocktailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
