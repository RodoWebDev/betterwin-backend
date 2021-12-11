import {
  Controller,
  Get,
  UseGuards,
  Param,
  UseInterceptors,
  Post,
  Body,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiUnauthorizedResponse, ApiBearerAuth, ApiParam, ApiTags, ApiBody, ApiOperation, ApiResponse, getSchemaPath, ApiCreatedResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { IResponse } from '../common/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { UserResponseDto } from './dto/user.dto';
import { UserPackageDto } from './dto/user-package.dto';
import { PackagesService as Packages_Service } from 'packages/packages.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller({
  path: 'users',
  version: '1',
})
@UseInterceptors(LoggingInterceptor, TransformInterceptor)

export class UsersController {
  constructor(
    private UsersService: UsersService,
    private Packages_Service: Packages_Service,
  ) {}

  @UseGuards(AuthGuard('jwt'))  
	@ApiParam({
		name: 'email',
	})
  @ApiOperation({ summary: 'Get User Informations API' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'SOME FIELD MISSING' })
  @ApiUnauthorizedResponse({ description: 'NOT AUTHORIZED' })
  @Get('user/:email')
  public async users(@Param() params): Promise<IResponse> {
    try {
      const response = await this.UsersService.findByEmail(params.email);
      response.password = undefined;
      return new ResponseSuccess('USER.SUCCESS',response);
    } catch (error) {
      return new ResponseError('USER.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add or Update User Package Informations API' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: UserPackageDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        packageId: { type: 'string' },
        totalPlayedTime: { type: 'number' },
        lastOnlineTime: { type: 'Date', format: 'date-time', example: '2018-11-21T06:20:32.232Z' },
        level: { type: 'number' },
        score: { type: 'number' },
        action: { type: 'string', description: '3 actions: start, update, end' },
      },
    },
  })
  @Post('package')
  async updatePackage(@Body() packageInfo, @Request() req){
    try {
      if (packageInfo.action === 'start') {
        await this.Packages_Service.addLivePlayers(packageInfo.packageId, req.user.email)
      } else {
        await this.Packages_Service.removeLivePlayers(packageInfo.packageId, req.user.email)
      }
      const response = await this.UsersService.updatePackage(req.user.email, packageInfo);
      return new ResponseSuccess('APKS.UPDATE.SUCCESS',response);
    } catch (error) {
      return new ResponseError('APKS.UPDATE.ERROR', error);
    }
  }
}
