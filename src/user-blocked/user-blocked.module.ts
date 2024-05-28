import { Module } from '@nestjs/common';
import { UserBlockedService } from './user-blocked.service';
import { UserBlockedController } from './user-blocked.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { UserBlocked, UserBlockedSchema } from './model/user-blocked.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: UserBlocked.name, schema: UserBlockedSchema },
      ]
    )
  ],
  controllers: [UserBlockedController],
  providers: [UserBlockedService],
  exports: [UserBlockedService]
})
export class UserBlockedModule { }
