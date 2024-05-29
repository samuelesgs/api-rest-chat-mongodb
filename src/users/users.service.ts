import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './model/user.schema';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { UserBlockedService } from 'src/user-blocked/user-blocked.service';
import { GeneralReponse } from 'src/auth/auth.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly serviceUserBlocks: UserBlockedService
  ) { }

  public async findUserBlocked(myEmail : string, anotherEmail : string) {
    return await this.serviceUserBlocks.findUserBlocked(myEmail, anotherEmail);
  }

  public async findByEmail(email: string) : Promise<User | null> {
      return await this.userModel.findOne({email});
  }

  public async emailAdd(myEmail: string, emailBlock: string) {
    const messageBlocked = await this.findUserBlocked(myEmail, emailBlock);
    if(messageBlocked) {
      return this.validateResponse(null, `Failed request create message, details: ${messageBlocked}`);
    }
    const user = await this.userModel.findOne({email: emailBlock});
    return this.validateResponse(user, `Success request find user`)
  }

  public async updateImg(email: string, filename: string) {
    try {
      const user = await this.userModel.findOne({email});
      if(user) {
        if(user.img) {
          await this.deleteFile(user.img);
        }
        user.img = filename;
        await user.save();
        return {
          data: user,
          staus: 1,
          message: 'Success request update user'
        }
      } else {
        return {
          data: null,
          staus: 2,
          message: 'Failed request update user, detail: user not found'
        }
      }
    } catch (error) {
      return {
        data: null,
        staus: 2,
        message: `Failed request update user, detail: ${error}`
      }
    }
  }

  private async deleteFile(filename: string) {
    const filePath = `./public/imgUsers/${filename}`;
    if(fs.existsSync(filePath)) {
      fs.unlink(filePath, ()=> {});
    }
  }

  async updateSocket(email : any, idSocket : string) {
    const user = await this.userModel.findOne({email});
    if (user) {
      user.id_socket = idSocket;
      user.save()
    }
  }

  private validateResponse(data: User | null, message: string): GeneralReponse {
    return {
      data,
      message,
      status: (data != null) ? 1 : 2
    }
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
