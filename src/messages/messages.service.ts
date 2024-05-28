import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './model/message.schema';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UsersService } from 'src/users/users.service';
import { FileBody, ResponseMessage } from 'src/utils/general.interfaces';
import * as moment from 'moment';
import { Socket } from 'socket.io';


@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
    private readonly serviceUser : UsersService,
  ) { }

  array : Map<string, Socket> = new Map();

  public setSockets(array : any) {
    this.array = array;
  }

  public async save(body: CreateMessageDto): Promise<ResponseMessage> {
    try {
      const messageBlocked = await this.serviceUser.findUserBlocked(body.send_by, body.send_to);
      if(!messageBlocked) {
        body.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        const message = await this.messageModel.create(body);
        return this.validateResponse(message, "Success request create message")
      } else {
        return this.validateResponse(null, `Failed request create message, details: ${messageBlocked}`);
      }
    } catch (error) {
      return this.validateResponse(null, `Failed request message, details: ${error.errmsg}`)
    }
  }

  public async delete(idMessage: string): Promise<ResponseMessage> {
    try {
      const message = await this.messageModel.findById({ _id: idMessage });
      if (message) {
        message.delete = 1;
        await message.save();
        return this.validateResponse(message, "Success request delete message");
      } else {
        return this.validateResponse(null, `Failed request delete message, details: message not found`);
      }
    } catch (error) {
      return this.validateResponse(null, `Failed request delete message, details: ${error}`);
    }
  }

  public async messageFile(body: FileBody, filename: string, extensionFile: string) {
    const myUser = await this.serviceUser.findByEmail(body.emailSendBy);
    const toUser = await this.serviceUser.findByEmail(body.emailSendTo);
    
    const date = moment().format('YYYY-MM-DD hh:mm:ss');
    const message: CreateMessageDto = {
      content: body.messageContent,
      type: extensionFile,
      send_by: body.emailSendBy,
      send_to: body.emailSendTo,
      filename: filename,
      datetime: date
    }
    const data = await this.save(message);

    if(myUser && toUser) {
      const mySocketClient : Socket = this.array.get(myUser.id_socket);
      const toSocketClient : Socket = this.array.get(toUser.id_socket);
      const socketData = {
        'data' : data.data,
        'message' : 'User connect'
      };
      if (mySocketClient) {
        mySocketClient.emit('message', socketData);
      }
      if (toSocketClient) {
        toSocketClient.emit('message', socketData);
      }
    }

    return data;
  }

  public async sync(email : string) {
    let allMessages : Message[] = await  this.messageModel.find({
      $or: [{ send_by: email }, { send_to: email }],
    }).exec();
    
    allMessages = allMessages.sort((a, b) =>{
      const dateA = moment(a.datetime);
      const dateB = moment(b.datetime);
      return dateB.isBefore(dateA) ? -1 : dateB.isAfter(dateA) ? 1 : 0;
    });

    let arrayChats : Chat[] = [];
    for (const message of allMessages) {
      const chat = arrayChats.find(it => it.another_email == message.send_by || it.another_email == message.send_to);
      if (!chat) {
        const anotherEmail = email != message.send_by ? message.send_by : message.send_to;
        const anotherUser = await this.serviceUser.findByEmail(anotherEmail);
        if (anotherUser) {
          const newChat  : Chat = {
            'another_email' : anotherEmail,
            'another_img' : anotherUser.img ?? null,
            'my_email' : email,
            'messages' : [message]
          }
          arrayChats.push(newChat)  
        }
      } else {
        chat.messages.push(message);
      }
    }
    return {
      data : arrayChats,
      status : 1,
      message : 'Success request sync message'
    };
  }

  private validateResponse(data: Message | null, message: string): ResponseMessage {
    return {
      data,
      message,
      status: (data != null) ? 1 : 2
    }
  }
}

export interface Chat {
  my_email : string;
  another_email : string;
  messages : Message[];
  another_img : string | null;
}