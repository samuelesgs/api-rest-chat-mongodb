import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/registrer-auth.dto';
import { LoginDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() user: RegisterAuthDto, @Res() response) {
    const data = await this.authService.register(user);
    return response.status(HttpStatus.OK).json(data);
  }

  @Post('login') 
  async loginUser(@Body() dataLoging: LoginDto, @Res() response) {
    const data = await this.authService.findByEmailAndPassword(dataLoging);
    return response.status(HttpStatus.OK).json(data);
  }
}
