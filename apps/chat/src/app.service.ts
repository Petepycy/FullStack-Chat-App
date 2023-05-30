import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './message.entity';
import { NewMessageDTO } from '../dtos/new-message.dto';

@Injectable()
export class AppService {
  checkUserExists(name: string) {
    throw new Error('Method not implemented.');
  }
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
      select: ['id', 'message'],
    }));
  
    if (!message) {
      throw new Error(`Message with id ${id} not found`);
    }
  
    message.message = 'DELETED';
    const deletedMessage = await this.messageRepository.save(message);

    return deletedMessage;
  }

  async clearMessages(): Promise<void> {
    await this.messageRepository.delete({});
  }
}
