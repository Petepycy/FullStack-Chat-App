import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  
  const USER = process.env.RABBITMQ_USER;
  const PASSWORD = process.env.RABBITMQ_PASS;
  const HOST = process.env.RABBITMQ_HOST;
  const QUEUE = process.env.RABBITMQ_AUTH_QUEUE;


  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
      noAck: false,
      queue: QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

app.startAllMicroservices();

}
bootstrap();
