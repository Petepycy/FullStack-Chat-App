import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';

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
          url: process.env.POSTGRES_CHAT_URI,
          autoLoadEntities: true,      
          synchronize: true,
        }),
        inject: [ConfigService],
      }),
  
      TypeOrmModule.forFeature([ImageEntity])
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
