import { Controller, Get } from '@nestjs/common';
import { ImageService } from './image.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { NewImageDTO } from '../dtos/new-image.dto';

@Controller()
export class ImageController {
 constructor(private readonly imageService: ImageService) {}

  @MessagePattern({ cmd: 'get-All-Images'})
  async getImages(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.imageService.getImages();
  }

  @MessagePattern({ cmd: 'post-image' })
  async postImage
  (@Ctx() context: RmqContext,
  @Payload() newImage: NewImageDTO 
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.imageService.postImage(newImage);
  }

  @MessagePattern({ cmd: 'delete-image' })
async deleteImage(
  @Ctx() context: RmqContext,
  @Payload() imageId: number,
) {
  const channel = context.getChannelRef();
  const message = context.getMessage();
  channel.ack(message);

  return this.imageService.deleteImage(imageId);

}

@MessagePattern({ cmd: 'clear-images' })
async clearImages(
  @Ctx() context: RmqContext,
) {
  const channel = context.getChannelRef();
  const message = context.getMessage();
  channel.ack(message);

  await this.imageService.clearImages();
}

}
