import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './model/message.schema';
import { UsersService } from 'src/users/users.service';
import { User, UserSchema } from 'src/users/model/user.schema';
import { SocketChatGateway } from 'src/socket-chat/socket-chat.gateway';
import { UserBlocked, UserBlockedSchema } from 'src/user-blocked/model/user-blocked.schema';
import { UserBlockedService } from 'src/user-blocked/user-blocked.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Message.name, schema: MessageSchema
        },
        {
          name: User.name, schema: UserSchema
        },
        {
          name: UserBlocked.name, schema: UserBlockedSchema
        },
        
      ]
    )
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    UsersService,
    UserBlockedService
  ],
  exports : [MessagesService]
})
export class MessagesModule {}
