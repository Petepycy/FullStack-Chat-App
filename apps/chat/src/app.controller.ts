import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { NewMessageDTO } from '../dtos/new-message.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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

  @MessagePattern({ cmd: 'delete-message' })
async deleteMessage(
  @Ctx() context: RmqContext,
  @Payload() messageId: number,
) {
  const channel = context.getChannelRef();
  const message = context.getMessage();
  channel.ack(message);

  return this.appService.deleteMessage(messageId);

}

@MessagePattern({ cmd: 'clear-messages' })
async clearMessages(
  @Ctx() context: RmqContext,
) {
  const channel = context.getChannelRef();
  const message = context.getMessage();
  channel.ack(message);

  await this.appService.clearMessages();
}

}
