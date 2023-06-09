import { Injectable } from '@nestjs/common';
import { NewImageDTO } from '../dtos/new-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from './image.entity';

@Injectable()
export class ImageService {

  constructor(@InjectRepository(ImageEntity) private readonly imageRepository: Repository<
  ImageEntity>){}

  async getImages(): Promise<ImageEntity[]> {
    return this.imageRepository.find({
      order: {
        id: "ASC"
      }
    });
  }
  
  async postImage(newImage: Readonly<NewImageDTO>)
  : Promise<ImageEntity> {
    
    const {name, image, fileName, fileType} = newImage;

    const savedImage = await this.imageRepository.save({
      name, image, fileName, fileType
    });
    return savedImage
  }

  async deleteImage(id: number): Promise<ImageEntity> {
    const image = await this.imageRepository.findOne(({
      where: {id},
      select: ['id', 'image', 'fileName', 'fileType'],
    }));
  
    if (!image) {
      throw new Error(`Image with id ${id} not found`);
    }
  
    image.image= '';
    image.fileName= '';
    image.fileType= '';
    
    const deletedImage= await this.imageRepository.save(image);

    return deletedImage;
  }

  async clearImages(): Promise<void> {
    await this.imageRepository.delete({});
  }
}


