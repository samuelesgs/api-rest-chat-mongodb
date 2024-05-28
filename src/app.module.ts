import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SocketChatGateway } from './socket-chat/socket-chat.gateway';
import { MessagesModule } from './messages/messages.module';
import { UserBlockedModule } from './user-blocked/user-blocked.module';
import { MulterModule } from '@nestjs/platform-express';
import { storage } from './utils/files.handel';
@Module({
  imports: [
    MulterModule.register({
      storage: storage
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    MongooseModule.forRoot('mongodb+srv://activityplannerweb:pbdhvKj0RP2mrpwL@clusterchat.tc7xfmv.mongodb.net/chat'),
    AuthModule,
    UsersModule,
    MessagesModule,
    UserBlockedModule
  ],
  controllers: [AppController],
  providers: [AppService, SocketChatGateway]
})
export class AppModule {
}
