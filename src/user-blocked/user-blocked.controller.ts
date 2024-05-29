import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserBlockedService } from './user-blocked.service';
import { CreateUserBlockedDto } from './dto/create-user-blocked.dto';
import { UpdateUserBlockedDto } from './dto/update-user-blocked.dto';

@Controller('user-blocked')
export class UserBlockedController {
  constructor(private readonly userBlockedService: UserBlockedService) {}

  @Post()
  public async addUser(@Body() data: CreateUserBlockedDto) {
    return await this.userBlockedService.addBlock(data);
  }

  @Get('getList')
  public async getList(@Query('myEmail') myEmail : string) {
    return await this.userBlockedService.findListBlocked(myEmail);
  }

  @Delete()
  public async remove(@Query('myEmail') myEmail : string, @Query('anotherEmail') anotherEmail : string) {
    return await this.userBlockedService.remove(myEmail, anotherEmail);
  }
}
