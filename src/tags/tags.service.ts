import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Model } from 'mongoose';
import { TagsInterface } from './interfaces/tags.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Observable } from 'rxjs';

@Injectable()
export class TagsExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    req.file['name'] = req.body.name;
    req.file['packageId'] = req.body.packageId;
    return next.handle();
  }
}

@Injectable()
export class TagsService {
	constructor(
    @InjectModel('Tags') private readonly TagsModel: Model<TagsInterface>,
	) { }

  async findByName(tagName: string): Promise<TagsInterface> {
    return await this.TagsModel.findOne({ tagName }).exec();
  }

  async getAllTags(): Promise<TagsInterface[]> {
    return await this.TagsModel.find().exec();
  }

  async saveTag(newTag: string){
    if (newTag) {
      const appRegistered = await this.findByName(newTag);
      if (!appRegistered) {
        const tempNewApp = {
          ...{tagName: newTag},
        };

        const createdTag = new this.TagsModel(tempNewApp);
        return await createdTag.save();
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