import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashFromRequest } from 'src/utils/hash-pass-from-request';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createUser = await hashFromRequest(createUserDto);
      const createdUser = new this.userModel(createUser);
      return await createdUser.save();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      return await this.userModel.findById(id,{password: 0});
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.userModel.findByIdAndUpdate(id, updateUserDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async updatePassword(id: string, updateUserDto: {oldPass: string,newPass: string}): Promise<User> {
    try {
      let user = await this.userModel.findById(id);
      if (user !== null) {
        const isMatch = await bcrypt.compare(updateUserDto.oldPass, user.password);
        if (isMatch) {
          const salt = await bcrypt.genSalt(10);
          const passwordHashed = await bcrypt.hash(updateUserDto.newPass, salt);
          return await this.userModel.findByIdAndUpdate(id,{password: passwordHashed});
        }
        else {
          throw new BadRequestException('Old password does not match');
        }
      }
       throw new UnauthorizedException()
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async remove(id: string): Promise<User> {
    try {
      return await this.userModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findByUsername(username: string): Promise<User> {
    try {
      return await this.userModel.findOne({ login: username });
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
