import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { NewUserDTO } from './dtos/new-user.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>){}

  async getUsers() {
    return this.userRepository.find();
  }

  async findIfExist (name: string): Promise<UserEntity>
  {
    return this.userRepository.findOne ({
      where: {name},
      select: ['id', 'name'],
    })
  }
  
  async register(newUser: Readonly<NewUserDTO>)
  : Promise<UserEntity> {
    
    const {name, password} = newUser;

    const existingUser = await this.findIfExist(name);

    if (existingUser) {
      throw new ConflictException('User already exists!');
    }

    const savedUser = await this.userRepository.save({
      name, password
    });

    //delete savedUser.password  ZMIENIĆ TO XDD
    return savedUser
  }

  async checkUserExists(name: string): Promise<boolean> {
    const existingUser = await this.findIfExist(name);
    return !!existingUser;
  }

}


