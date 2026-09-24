import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CocktailsModule } from './cocktails/cocktails.module';

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

    UsersModule,
    CocktailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
