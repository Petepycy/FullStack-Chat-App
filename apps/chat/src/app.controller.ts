import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { NewMessageDTO } from '../dtos/new-message.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
  @Inject ('AUTH_SERVICE') private authService: ClientProxy,
  @Inject ('IMAGE_SERVICE') private imageService: ClientProxy) {}

  @MessagePattern({ cmd: 'get-All-Messages'})
  async getMessages(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.appService.getMessages();
  }


  @MessagePattern({ cmd: 'post-message' })
  async postMessage
  (@Ctx() context: RmqContext,
  @Payload() newMessage: NewMessageDTO 
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.appService.postMessage(newMessage);
  }

//   @MessagePattern({ cmd: 'delete-message' })
// async deleteMessage(
//   @Ctx() context: RmqContext,
//   @Payload() messageId: number,
// ) {
//   const channel = context.getChannelRef();
//   const message = context.getMessage();
//   channel.ack(message);

//   return this.appService.deleteMessage(messageId);

// }

@MessagePattern({ cmd: 'clear-messages' })
async clearMessages(
  @Ctx() context: RmqContext,
) {
  const channel = context.getChannelRef();
  const message = context.getMessage();
  channel.ack(message);

  await this.appService.clearMessages();
}

@MessagePattern({ cmd: 'delete-message' })
async deleteMessage(
  @Ctx() context: RmqContext,
  @Payload() id: number, name: string
) {
  const channel = context.getChannelRef();
  const message = context.getMessage();
  channel.ack(message);

  // Send a request to the auth service to check if the user exists
  const userExists = await this.checkUserExists(name);

  // if (userExists) {
  //   return this.appService.deleteMessage(id);
  // } else {
  //   throw new Error('User does not exist');
  // }

  if (userExists) {
    const deleteMessageResponse = this.appService.deleteMessage(id);
    const deleteImageResponse = this.imageService.send({ cmd: 'delete-image' }, { id });

    return Promise.all([deleteMessageResponse, deleteImageResponse]);
  } else {
    throw new Error('User does not exist');
  }
}

async checkUserExists(name: string): Promise<boolean> {
  // Send a request to the auth service to check if the user exists
  const response = await this.authService.send(
    { cmd: 'checkUserExists' },
    { name },
  ).toPromise();

  return response.exists;
}
}
