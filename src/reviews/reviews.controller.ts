import { Controller, Get, UseGuards, UseInterceptors, Request, Post, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReviewsService } from './reviews.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { IResponse } from 'common/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from 'common/dto/response.dto';
import { ReviewsDto } from './dto/reviews.dto';
import { PackagesService } from 'packages/packages.service';

@ApiTags('Reviews')
@ApiBearerAuth()
@Controller({
  path: 'reviews',
  version: '1',
})
@UseInterceptors(LoggingInterceptor, TransformInterceptor)

export class ReviewsController {
	constructor(
    private ReviewsService: ReviewsService,
    private PackagesService: PackagesService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add rating API with rating and packageId' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: ReviewsDto,
  })
  @Post('/rating')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rating: { type: 'number' },
        packageId: { type: 'string' },
      },
    },
  })
  async addRating(@Body() reviewInfo, @Request() req){
    try {
      const response = await this.ReviewsService.addRating(req.user._id, reviewInfo);
      await this.PackagesService.addRating(reviewInfo);
      return new ResponseSuccess('REVIEWS.ADDRATING.SUCCESS',response);
    } catch (error) {
      return new ResponseError('REVIEWS.ADDRATING.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add comment API with comment and packageId' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: ReviewsDto,
  })
  @Post('/comment')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: { type: 'string' },
        packageId: { type: 'string' },
      },
    },
  })
  async addComment(@Body() reviewInfo, @Request() req){
    try {
      const response = await this.ReviewsService.addComment(req.user._id, reviewInfo);
      return new ResponseSuccess('REVIEWS.ADDCOMMENT.SUCCESS',response);
    } catch (error) {
      return new ResponseError('REVIEWS.ADDCOMMENT.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add like API with userId and packageId' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: ReviewsDto,
  })
  @Post('/like')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        packageId: { type: 'string' },
      },
    },
  })
  async addLike(@Body() reviewInfo, @Request() req){
    try {
      const response = await this.ReviewsService.addLike(req.user._id, reviewInfo);
      return new ResponseSuccess('REVIEWS.ADDLIKE.SUCCESS',response);
    } catch (error) {
      return new ResponseError('REVIEWS.ADDLIKE.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add unLike API with userId and packageId' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: ReviewsDto,
  })
  @Post('/unLike')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        packageId: { type: 'string' },
      },
    },
  })
  async addUnLike(@Body() reviewInfo, @Request() req){
    try {
      const response = await this.ReviewsService.addUnLike(req.user._id, reviewInfo);
      return new ResponseSuccess('REVIEWS.ADDUNLIKE.SUCCESS',response);
    } catch (error) {
      return new ResponseError('REVIEWS.ADDUNLIKE.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all reviews API' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: [ReviewsDto],
  })
  @Get('')
  public async getAllReviews(@Request() req): Promise<IResponse> {
    try {
      const response = await this.ReviewsService.getAllReviews();
      return new ResponseSuccess('APKS.GETLIST.SUCCESS',response);
    } catch (error) {
      return new ResponseError('APKS.GETLIST.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all reviews API by packageId' })
  @ApiParam({
    name: 'packageId',
  })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: [ReviewsDto],
  })
  @Get(':packageId')
  public async getReviewsByPackageId(@Request() req, @Param() params): Promise<IResponse> {
    try {
      const response = await this.ReviewsService.getReviewsByPackageId(params.packageId);
      return new ResponseSuccess('APKS.GETLISTBYPACKAGEID.SUCCESS',response);
    } catch (error) {
      return new ResponseError('APKS.GETLISTBYPACKAGEID.ERROR', error);
    }
  }
}