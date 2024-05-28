import { Body, Controller, Delete, Get, Post, Query, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileBody } from 'src/utils/general.interfaces';
import { storage } from 'src/utils/files.handel';
import { Socket } from 'socket.io';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Get('sync')
  async sync(@Query('email') email : string) {
    return await this.messagesService.sync(email);
  }

  @Post('create')
  async create(@Body() message: CreateMessageDto) {
    return await this.messagesService.save(message);
  }

  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file', {storage:storage}))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: FileBody) {
    const extension = file.originalname.split('.').pop();
    return await this.messagesService.messageFile(body, file.filename, extension)
  }
  
  @Get('download')
  async downloadFile(@Query('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '..', '..', 'public/docs', filename); // ajusta la ruta según tu estructura de proyecto
    if (fs.existsSync(filePath)) {
      res.download(filePath, filename, (err) => {
        if (err) {
          res.status(500).send({
            message: 'Error al descargar el archivo',
          });
        }
      });
    } else {
      res.status(404).send({
        message: 'Archivo no encontrado',
      });
    }
  }

  @Delete()
  async delete(@Query('id') idMessage: string) {
    return await this.messagesService.delete(idMessage);
  }

}
