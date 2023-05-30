import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

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
        //url: configService.get('POSTGRES_CHAT_URI'),
        url: 'postgresql://user:passoword@chat-db:5432/chat',
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    
    TypeOrmModule.forFeature([MessageEntity])
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => 
      {
        const USER = configService.get('RABBITMQ_USER');
        const PASSWORD = configService.get('RABBITMQ_PASS');
        const HOST = configService.get('RABBITMQ_HOST');
        const QUEUE = configService.get('RABBITMQ_DELETE_QUEUE');
  
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              queue: QUEUE,
              queueOptions: {
                durable: true,
               },
           },
         });
      },
      inject: [ConfigService],
    },
    {
      provide: 'IMAGE_SERVICE',
      useFactory: (configService: ConfigService) => 
      {
        const USER = configService.get('RABBITMQ_USER');
        const PASSWORD = configService.get('RABBITMQ_PASS');
        const HOST = configService.get('RABBITMQ_HOST');
        const QUEUE = configService.get('RABBITMQ_DELETE_IMAGE_QUEUE');
  
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              queue: QUEUE,
              queueOptions: {
                durable: true,
               },
           },
         });
      },
      inject: [ConfigService],
    }],
})
export class AppModule {}
