import { Controller, Get, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { IResponse } from 'common/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from 'common/dto/response.dto';
import { CategoriesDto } from './dto/categories.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller({
  path: 'categories',
  version: '1',
})
@UseInterceptors(LoggingInterceptor, TransformInterceptor)

export class CategoriesController {
	constructor(
    private CategoriesService: CategoriesService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all categories API' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: [CategoriesDto],
  })
  @Get('')
  public async getAllCategories(): Promise<IResponse> {
    try {
      const response = await this.CategoriesService.getAllCategories();
      return new ResponseSuccess('APKS.GETLIST.SUCCESS',response);
    } catch (error) {
      return new ResponseError('APKS.GETLIST.ERROR', error);
    }
  }
}