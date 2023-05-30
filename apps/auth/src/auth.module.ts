import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Module({
  imports: [ 
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: './.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        //url: configService.get('POSTGRES_AUTH_URI'),
        url: 'postgresql://user:passoword@auth-db:5432/auth',
        autoLoadEntities: true,
       
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
