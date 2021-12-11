import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, getSchemaPath, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Login } from './interfaces/login.interface';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({ summary: 'User Login API' })
  @Post('email/login')
  @ApiCreatedResponse({
    description: 'Success Response',
    type: AuthResponseDto,
  })
  public async login(@Body() login: Login): Promise<IResponse> {
    try {
      const response = await this.authService.validateLogin(
        login.email.toLowerCase(),
        login.password,
      );
      return new ResponseSuccess('LOGIN.SUCCESS', response);
    } catch (error) {
      return new ResponseError('LOGIN.ERROR', error);
    }
  }

  @ApiOperation({ summary: 'User Register API' })
  @ApiResponse({ status: 200, description: 'Success Response', schema: {$ref: getSchemaPath(AuthResponseDto)}})  
  @Post('email/register')
  async register(@Body() createUserDto: UserDto): Promise<IResponse> {
    try {
      // const newUser = await this.userService.createNewUser(createUserDto);
      // await this.authService.createEmailToken(newUser.email);
      const sent = await this.authService.sendEmailVerification(createUserDto.email.toLowerCase());
      if (sent) {
        // const userdetail = await this.authService.getAccessToken(newUser._id);
        // return new ResponseSuccess('REGISTRATION.USER_REGISTERED_SUCCESSFULLY',userdetail);
        return new ResponseSuccess('REGISTRATION.USER_REGISTERED_SUCCESSFULLY', { message: 'verify email sent' });
      } else {
        return new ResponseError('REGISTRATION.ERROR.MAIL_NOT_SENT');
      }
    } catch (error) {
      console.log(error);
      return new ResponseError('REGISTRATION.ERROR.GENERIC_ERROR', error);
    }
  }
}
