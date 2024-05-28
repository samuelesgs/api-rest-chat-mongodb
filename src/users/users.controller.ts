import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, flatten, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageUser } from 'src/utils/files.handel';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('fileProfile')
  @UseInterceptors(FileInterceptor('file', {storage: storageUser}))
  async fileProfile(@UploadedFile() file: Express.Multer.File, @Query('email') email: string) {
    return await this.usersService.updateImg(email, file.filename);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('find-email')
  async findEmail(@Query('my-email') myEmail : string, @Query('another-email') anotherEmail: string) {
    return await this.usersService.emailAdd(myEmail, anotherEmail);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
