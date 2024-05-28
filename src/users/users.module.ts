import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.schema';
import { UserBlockedService } from 'src/user-blocked/user-blocked.service';
import { UserBlocked, UserBlockedSchema } from 'src/user-blocked/model/user-blocked.schema';

@Module({
  imports : [
    MongooseModule.forFeature(
      [
        { name : User.name, schema:UserSchema },
        { name: UserBlocked.name, schema: UserBlockedSchema },
      ]
    )
  ],
  controllers: [UsersController],
  providers: [UsersService, UserBlockedService],
  exports : [UsersService]
})
export class UsersModule {}
