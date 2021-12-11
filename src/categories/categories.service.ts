import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Model } from 'mongoose';
import { CategoriesInterface } from './interfaces/categories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Observable } from 'rxjs';

@Injectable()
export class CategoriesExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    req.file['name'] = req.body.name;
    req.file['packageId'] = req.body.packageId;
    return next.handle();
  }
}

@Injectable()
export class CategoriesService {
	constructor(
    @InjectModel('Categories') private readonly CategoriesModel: Model<CategoriesInterface>,
	) { }

  async findByName(categoryName: string): Promise<CategoriesInterface> {
    return await this.CategoriesModel.findOne({ categoryName }).exec();
  }

  async getAllCategories(): Promise<CategoriesInterface[]> {
    return await this.CategoriesModel.find().exec();
  }

  async saveCategory(newCategory: string){
    if (newCategory) {
      const appRegistered = await this.findByName(newCategory);
      if (!appRegistered) {
        const tempNewApp = {
          ...{categoryName: newCategory},
        };

        const createdCategory = new this.CategoriesModel(tempNewApp);
        return await createdCategory.save();
      } else {
        throw new HttpException(
          'REGISTRATION.USER_ALREADY_REGISTERED',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        'REGISTRATION.MISSING_MANDATORY_PARAMETERS',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}