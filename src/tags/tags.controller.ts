import { Controller, Get, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TagsService } from './tags.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { IResponse } from 'common/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from 'common/dto/response.dto';
import { TagsDto } from './dto/tags.dto';

@ApiTags('Tags')
@ApiBearerAuth()
@Controller({
  path: 'tags',
  version: '1',
})
@UseInterceptors(LoggingInterceptor, TransformInterceptor)

export class TagsController {
	constructor(
    private TagsService: TagsService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all tags API' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: [TagsDto],
  })
  @Get('')
  public async getAllTags(@Request() req): Promise<IResponse> {
    try {
      const response = await this.TagsService.getAllTags();
      return new ResponseSuccess('APKS.GETLIST.SUCCESS',response);
    } catch (error) {
      return new ResponseError('APKS.GETLIST.ERROR', error);
    }
  }
}