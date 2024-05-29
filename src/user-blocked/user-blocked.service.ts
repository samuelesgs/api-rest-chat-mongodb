import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserBlocked } from './model/user-blocked.schema';
import { Model } from 'mongoose';
import { CreateUserBlockedDto } from './dto/create-user-blocked.dto';
import { ResponseBlockeds } from 'src/utils/general.interfaces';

@Injectable()
export class UserBlockedService {
  constructor(
    @InjectModel(UserBlocked.name) private readonly userBlockedModel: Model<UserBlocked>,
  ) { }

  public async addBlock(data: CreateUserBlockedDto) {
    try {
      const list = await this.userBlockedModel.findOne({emailOwner: data.emailOwner});
      if(list) {
        this.addUserToList(list, data.emailBlock);
        list.save();
        return this.validateReseponse(list, "Success request user block");
      } else {
        const newList = await this.saveNewList(data);
        return this.validateReseponse(newList, "Success request user block");
      }
    } catch (error) {
      return this.validateReseponse(null, `Failed request user blokc, details: ${error}`);
    }
  }

  public async findUserBlocked(myEmail: string, emailBlock: string) {
    try {
      const list = await this.findListOwner(myEmail);
      const anotherList = await this.findListOwner(emailBlock);
      if( list && list.emailList.includes(emailBlock)) {
        return `You have blocked user: ${emailBlock}`;
      }
      if(anotherList && anotherList.emailList.includes(myEmail)) {
        return `User: ${emailBlock} has you blocked`;
      }
      return  null;
    } catch (error) {
      console.log(error);
      
      return null;
    }
  }

  public async findListOwner(email: string): Promise<UserBlocked> {
    try {
      return await this.userBlockedModel.findOne({emailOwner: email});
    } catch (error) {
      console.log(error);      
      return null;
    }
  }

  public async findListBlocked(email: string): Promise<any> {
    try {
      const data = await this.findListOwner(email);
      return {
        data: data,
        status: 1,
        message: 'Success request getList blocked'
      }
    } catch (error) {
      return {
        data: null,
        status: 2,
        message: 'Failed request getList blocked detail: ' + error
      }
    }
  }

  public async remove(myEmail : string, anotherEmail : string) {
    try{
      const list = await this.userBlockedModel.findOne({emailOwner: myEmail});
      if(list) {
        await this.removeUserToList(list, anotherEmail);
        list.save();
        return this.validateReseponse(list, "Success request remove user block");
      } else {
        return this.validateReseponse(true, "Success request remove  user block");
      }
    } catch (error) {
      return this.validateReseponse(null, `Failed request user blokc, details: ${error}`);
    }
  }
  
  private async removeUserToList(data: UserBlocked, emailBlock: string) {
    if(data.emailList.includes(emailBlock)) {
      data.emailList = data.emailList.filter(row => row != emailBlock)
    }
  }


  private async saveNewList(data: CreateUserBlockedDto) {
    try {
      return await this.userBlockedModel.create(
        {
          emailOwner: data.emailOwner,
          emailList: [data.emailBlock]
        }
      );
    } catch (error) {
      console.log("error", error);
      return null;
    }
  }

  private async addUserToList(data: UserBlocked, emailBlock: string) {
    if(!data.emailList.includes(emailBlock)) {
      data.emailList.push(emailBlock);
    }
  }

  private validateReseponse(data: UserBlocked | null | Boolean, message: string): ResponseBlockeds {
    return {
      data: data ? data : null,
      status: data ? 1 : 2,
      message: message
    }
  }
}
