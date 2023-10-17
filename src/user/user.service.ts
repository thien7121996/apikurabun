import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { UserEntity } from './entitites/user.entity';
import { Repository, DataSource } from 'typeorm';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { CreateUserDto } from './dtos/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  create(request: CreateUserDto) {
    const user = this.userRepo.create(request);
    if (!user) throw new Error('Create user failed');
    return this.userRepo.save(user);
  }

  findById(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  findAll() {
    return this.userRepo.find();
  }

  async updateById(id: number, request: UpdateUserDto) {
    let user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user = { ...user, ...request };

    return this.userRepo.save(user);
  }
  async deleteById(id: number) {
    const user = await this.findById(id);
    if (!user) new Error('User not found');
    return this.userRepo.remove(user);
  }
}
