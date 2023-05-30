import { Inject, Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  controllers: [ApiController],
  providers: [ApiService,
  {
    provide: 'AUTH_SERVICE',
    useFactory: (configService: ConfigService) => 
    {
      const USER = configService.get('RABBITMQ_USER');
      const PASSWORD = configService.get('RABBITMQ_PASS');
      const HOST = configService.get('RABBITMQ_HOST');
      const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

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
      provide: 'CHAT_SERVICE',
      useFactory: (configService: ConfigService) => 
      {
        const USER = configService.get('RABBITMQ_USER');
        const PASSWORD = configService.get('RABBITMQ_PASS');
        const HOST = configService.get('RABBITMQ_HOST');
        const QUEUE = configService.get('RABBITMQ_CHAT_QUEUE');
  
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
      const QUEUE = configService.get('RABBITMQ_IMAGE_QUEUE');

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
  ],
})
export class ApiModule {}
