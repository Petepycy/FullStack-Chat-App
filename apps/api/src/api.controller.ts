import { Body, Controller, Get, Inject, Post} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NewMessageDTO } from 'apps/chat/dtos/new-message.dto';
import { NewImageDTO } from 'apps/image/dtos/new-image.dto';
import { Observable } from 'rxjs';


@Controller()
export class ApiController {
  constructor(
    @Inject ('AUTH_SERVICE') private authService: ClientProxy,
    @Inject('CHAT_SERVICE') private chatService: ClientProxy,
    @Inject('IMAGE_SERVICE') private imageService: ClientProxy
  ) {}

  @Get ('auth/getUsers')
  async getUsers() {
    return this.authService.send(
      {
        cmd: 'get-users',
      }, 
      {},
    );  
   }

  @Post ('auth/register')
  async register(
    @Body('name') name: string,
    @Body('password') password: string,
  ) {
    return this.authService.send (
      {
        cmd: 'register',
      },
      {
        name,
        password,
      },
    )
  }

@Post('chat/postMessage')
async postMessage(@Body() messageDto: NewMessageDTO) {
    return this.chatService.send({ cmd: 'post-message' }, messageDto);
  }

@Post('image/postImage')
async postImage(@Body() imageDto: NewImageDTO) {
    return this.imageService.send({ cmd: 'post-image' }, imageDto);
  }
/*
@Post('chat/postMessage')
async postMessage(@Body()imageDto: NewImageDTO, @Body()messageDto: NewMessageDTO ) {
    const [savedMessage, savedImage] = await Promise.all([
      this.chatService.send({ cmd: 'post-message' }, messageDto),
      this.imageService.send({ cmd: 'post-image' }, imageDto),
    ]);
  
    return { savedMessage, savedImage };
  }
*/
  @Get('chat/getAll')
  async getAll() {
    const messageResponse = this.chatService.send({ cmd: 'get-All-Messages' }, {});
    const imageResponse =  this.imageService.send({ cmd: 'get-All-Images'}, {} );
    return { messageResponse , imageResponse };
  }

@Get ('chat/getAllMessages')
async getMessages() {
  return this.chatService.send(
    {
      cmd: 'get-All-Messages',
    }, 
    {},
  );  
 }

 @Get ('chat/getAllImages')
 async getImages() {
   return this.imageService.send(
     {
       cmd: 'get-All-Images',
     }, 
     {},
   );  
  }

   @Post('chat/deleteMessage')
async deleteMessage(@Body('id') id: number,
@Body('name') name: number) {
  return this.chatService.send(
    { cmd: 'delete-message' },
    {
    id,
    name
    }
  );
}

  @Post('image/deleteImage')
async deleteImage(@Body('id') id: number) {
  return this.imageService.send(
    { cmd: 'delete-image' },
    id,
  );
}

@Post('chat/clear')
async clearMessages(): Promise<Observable<void>> {
  return this.chatService.send({ cmd: 'clear-messages' }, {});
}

@Post('image/clear')
async clearImages(): Promise<Observable<void>> {
  return this.imageService.send({ cmd: 'clear-images' }, {});
}

}
