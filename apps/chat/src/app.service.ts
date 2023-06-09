import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './message.entity';
import { NewMessageDTO } from '../dtos/new-message.dto';

@Injectable()
export class AppService {
  constructor(@InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>){}

  async getMessages(): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      order: {
        id: "ASC"
      }
    });
  }

  async postMessage(newMessage: Readonly<NewMessageDTO>)
  : Promise<MessageEntity> {
    
    const {name, message, image, fileName, fileType }= newMessage;

    const savedMessage = await this.messageRepository.save({
      name, message, image, fileName, fileType
    });

    return savedMessage
  }

  async deleteMessage(id: number): Promise<MessageEntity> {
    const message = await this.messageRepository.findOne(({
      where: {id},
      select: ['id', 'message', 'image', 'fileName', 'fileType'],
    }));
  
    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }
  
    message.message = 'DELETED';
    message.image= '';
    message.fileName= '';
    message.fileType= '';
    const deletedMessage = await this.messageRepository.save(message);

    return deletedMessage;
  }

  async clearMessages(): Promise<void> {
    await this.messageRepository.delete({});
  }
}
