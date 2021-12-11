import { Controller, Get, UseGuards, Header, UseInterceptors, Post, UploadedFile, Res, Param, Delete, Body, Patch, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam, ApiConsumes, ApiBody, ApiOperation, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { PackagesExtender, PackagesService } from './packages.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { IResponse } from 'common/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from 'common/dto/response.dto';
import { PackagesDto } from './dto/packages.dto';
import { CategoriesService } from 'categories/categories.service';
import { TagsService } from 'tags/tags.service';
import { PackagesInterface } from './interfaces/packages.interface';

@ApiTags('Packages')
@ApiBearerAuth()
@Controller({
  path: 'packages',
  version: '1',
})
@UseInterceptors(LoggingInterceptor, TransformInterceptor)

export class PackagesController {
	constructor(
    private PackagesService: PackagesService,
    private CategoriesService: CategoriesService,
    private TagsService: TagsService,
  ) {}

  async updateCategories(categories) {
    const responseCat = await this.CategoriesService.getAllCategories();
    const oldCategories = responseCat.map(category => category.categoryName);
    categories.forEach(async (category) => {
      if (!oldCategories.includes(category)) {
        await this.CategoriesService.saveCategory(category);
      }
    })
  }

  async updateTags(tags) {
    const responseTag = await this.TagsService.getAllTags();
    const oldTags = responseTag.map(tag => tag.tagName);
    tags.forEach(async (tag) => {
      if (!oldTags.includes(tag)) {
        await this.TagsService.saveTag(tag);
      }
    })
  }

  getPackageResult(response: PackagesInterface, length: number) {
    return {
      _id: response._id,
      name: response.name,
      packageId: response.packageId,
      originalname: response.originalname,
      description: response.description,
      publishedBy: response.publishedBy,
      status: response.status,
      categories: response.categories,
      livePlayers: response.livePlayers,
      tags: response.tags,
      rating: response.rating,
      icon: response.icon,
      imgs: response.imgs,
      downloads: length,
    }
  }

  getPackagesResult(response: PackagesInterface[]) {
    return response.map(app => {
      const length = app.downloads.length;
      return this.getPackageResult(app, length);
    })
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all packages API' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: [PackagesDto],
  })
  @Get('')
  public async getAllPackages(): Promise<IResponse> {
    try {
      const response = await this.PackagesService.getAllPackages();
      const result = this.getPackagesResult(response);
      return new ResponseSuccess('APKS.GETALLLIST.SUCCESS', result);
    } catch (error) {
      return new ResponseError('APKS.GETALLLIST.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Upload package API with package informations' })
  @ApiResponse({ status: 200, description: 'Success Response', type: String})
  @Post('')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        packageId: { type: 'string' },
        description: { type: 'string' },
        publishedBy: { type: 'string' },
        status: { type: 'string' },
        categories: { type: 'string', description: 'Casino, Sports' },
        tags: { type: 'string', description: 'archering, 2 player' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(PackagesExtender)
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file, @Body() packageInfo){
    try {
      const app = {
        originalname: file.originalname,
        name: packageInfo.name,
        packageId: packageInfo.packageId,
        description: packageInfo.description,
        publishedBy: packageInfo.publishedBy,
        status: packageInfo.status,
        categories: packageInfo.categories.replace(/\s/g, '').split(','),
        tags: packageInfo.tags.replace(/\s/g, '').split(','),
      };
      this.updateCategories(app.categories);
      this.updateTags(app.tags);
      await this.PackagesService.saveAppToDB(app);
      await this.PackagesService.upload(file);
      return "uploaded";
    } catch (error) {
      return new ResponseError('APKS.UPLOAD.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Search packages API with name' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: [PackagesDto],
  })
  @ApiParam({
    name: 'keyword',
  })
  @Get('search/:keyword')
  public async getSearchedPacakges(@Param() params): Promise<IResponse> {
    try {
      const response = await this.PackagesService.getSearchedPacakges(params.keyword);
      const result = this.getPackagesResult(response);
      return new ResponseSuccess('APKS.GETSEARCHEDLIST.SUCCESS', result);
    } catch (error) {
      return new ResponseError('APKS.GETSEARCHEDLIST.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Search packages API with name and category name' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: [PackagesDto],
  })
  @ApiParam({
    name: 'keyword',
  })
  @ApiParam({
    name: 'category',
  })
  @Get('search/:keyword/category/:category')
  public async getSearchedPacakgesFromStore(@Param() params): Promise<IResponse> {
    try {
      const response = await this.PackagesService.getSearchedPacakgesFromStore(params.keyword, params.category);
      const result = this.getPackagesResult(response);
      return new ResponseSuccess('APKS.GETSEARCHEDPACKAGELIST.SUCCESS', result);
    } catch (error) {
      return new ResponseError('APKS.GETSEARCHEDPACKAGELIST.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get recommended packages API' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: [PackagesDto],
  })
  @Get('recommended')
  public async getRecommendedPackages(): Promise<IResponse> {
    try {
      const response = await this.PackagesService.getAllPackages();
      const result = this.getPackagesResult(response);
      return new ResponseSuccess('APKS.GETRECOMMENDEDLIST.SUCCESS', result);
    } catch (error) {
      return new ResponseError('APKS.GETRECOMMENDEDLIST.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get recommended packages API' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: [PackagesDto],
  })
  @Get('trending')
  public async getTrendingPackages(): Promise<IResponse> {
    try {
      const response = await this.PackagesService.getAllPackages();
      const result = this.getPackagesResult(response);
      return new ResponseSuccess('APKS.GETTREDINGLIST.SUCCESS', result);
    } catch (error) {
      return new ResponseError('APKS.GETTREDINGLIST.ERROR', error);
    }
  }

  @Get('download/betterwin')
  @ApiOperation({ summary: 'Download BetterWin app API' })
  @Header('Content-Type','apk')
  @Header('Content-Disposition', 'attachment; filename=betterwin.apk')
  async downloadBetterwinPackage(@Res() res){
    try {
      const app = await this.PackagesService.findByName('betterwin');
      const file = await this.PackagesService.getfileStream(app.originalname);
      return file.pipe(res);
    } catch (error) {
      return new ResponseError('APKS.DOWNLOAD.BETTERWIN.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Download package API with packageId' })
  @ApiParam({
    name: 'packageId',
  })
  @Get('download/:packageId')
  @Header('Content-Type','apk')
  @Header('Content-Disposition', 'attachment; filename=app.apk')
  async downloadPackage(@Res() res, @Param() params, @Request() req){
    try {
      const app = await this.PackagesService.findByName(params.packageId);
      const file = await this.PackagesService.getfileStream(app.originalname);
      await this.PackagesService.addDownload(params.packageId, req.user._id);
      return file.pipe(res);
    } catch (error) {
      return new ResponseError('APKS.DOWNLOAD.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get package information API with packageId' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: PackagesDto,
  })
  @ApiParam({
    name: 'packageId',
  })
  @Get(':packageId')
  public async getPacakgeInfo(@Param() params): Promise<IResponse> {
    try {
      const app = await this.PackagesService.findByName(params.packageId);
      const length = app.downloads.length;
      app.downloads = undefined;
      const response = this.getPackageResult(app, length);
      return new ResponseSuccess('APKS.GETPACKAGE.SUCCESS', response);
    } catch (error) {
      return new ResponseError('APKS.GETPACKAGE.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete existing package API with packageId' })
	@ApiParam({
    name: 'packageId',
  })
  @Delete(':packageId')
  async delete(@Param() params){
    try {
      const app = await this.PackagesService.findByName(params.packageId);
      await this.PackagesService.deleteOrder(app._id);
      await this.PackagesService.delete(app.originalname);
      return "deleted";
    } catch (error) {
      return new ResponseError('APKS.DELETE.ERROR', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update existing package API with packageId and updated informations' })
  @ApiCreatedResponse({
    description: 'Success Response',
    type: PackagesDto,
  })
	@ApiParam({
    name: 'packageId',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        publishedBy: { type: 'string' },
        status: { type: 'string' },
        categories: { type: 'string', description: 'Casino, Sports' },
        tags: { type: 'string', description: 'archering, 2 player' },
      },
    },
  })
  @Patch(':packageId')
  async update(@Param() params, @Body() packageInfo){
    try {
      const newCategories = packageInfo.categories.replace(/\s/g, '').split(',');
      this.updateCategories(newCategories);
      const newTags = packageInfo.tags.replace(/\s/g, '').split(',');
      this.updateTags(newTags);
      const app = await this.PackagesService.update(params.packageId, {...packageInfo, categories: packageInfo.categories.replace(/\s/g, '').split(','), tags: packageInfo.tags.replace(/\s/g, '').split(',')});
      const length = app.downloads.length;
      app.downloads = undefined;
      const response = this.getPackageResult(app, length);
      return new ResponseSuccess('APKS.UPDATE.SUCCESS',response);
    } catch (error) {
      return new ResponseError('APKS.UPDATE.ERROR', error);
    }
  }
}