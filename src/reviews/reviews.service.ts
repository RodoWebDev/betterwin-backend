import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ReviewsInterface } from './interfaces/reviews.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Observable } from 'rxjs';

@Injectable()
export class ReviewsExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    req.file['name'] = req.body.name;
    req.file['packageId'] = req.body.packageId;
    return next.handle();
  }
}

@Injectable()
export class ReviewsService {
	constructor(
    @InjectModel('Reviews') private readonly ReviewsModel: Model<ReviewsInterface>,
	) { }

  async addRating(id: string | Types.ObjectId, reviewInfo: any): Promise<ReviewsInterface> {
    const userId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const reviewRegistered = await this.ReviewsModel.findOne({ userId, packageId: reviewInfo.packageId }).exec();
    if (!reviewRegistered) {
      const tempNewApp = {
        ...reviewInfo, userId
      };
      const createdReview = new this.ReviewsModel(tempNewApp);
      return await createdReview.save();
    } else {
      reviewRegistered.rating = reviewInfo.packageId;
      await reviewRegistered.save();
      return reviewRegistered;
    }
  }

  async addComment(id: string | Types.ObjectId, reviewInfo: any): Promise<ReviewsInterface> {
    const userId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const reviewRegistered = await this.ReviewsModel.findOne({ userId, packageId: reviewInfo.packageId }).exec();
    if (!reviewRegistered) {
      const tempNewApp = {
        packageId: reviewInfo.packageId,
        userId,
        comment: {
          comment: reviewInfo.comment
        }
      };
      const createdReview = new this.ReviewsModel(tempNewApp);
      return await createdReview.save();
    } else {
      reviewRegistered.comment = { comment: reviewInfo.comment };
      await reviewRegistered.save();
      return reviewRegistered;
    }
  }

  async addLike(id: string | Types.ObjectId, reviewInfo: any): Promise<ReviewsInterface> {
    const userId = typeof id === 'string' ? new Types.ObjectId(reviewInfo.userId) : reviewInfo.userId;
    const _id = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const reviewRegistered = await this.ReviewsModel.findOne({ userId, packageId: reviewInfo.packageId }).exec();
    if (!reviewRegistered) {
      throw new HttpException('REVIEWS.ADDLIKE.REVIEW_NOT_FOUND', HttpStatus.NOT_FOUND);
    } else {
      let { like, unLike } = reviewRegistered;
      let contain = false;
      like.forEach(item => {
        if(item === _id) {
          contain = true;
        }
      })
      if (!contain) {
        like.push(_id);
      }
      const index = unLike.indexOf(_id);
      if (index > -1) {
        unLike.splice(index, 1);
      }
      reviewRegistered.like = like;
      reviewRegistered.unLike = unLike;
      await reviewRegistered.save();
      return reviewRegistered;
    }
  }

  async addUnLike(id: string | Types.ObjectId, reviewInfo: any): Promise<ReviewsInterface> {
    const userId = typeof id === 'string' ? new Types.ObjectId(reviewInfo.userId) : reviewInfo.userId;
    const _id = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const reviewRegistered = await this.ReviewsModel.findOne({ userId, packageId: reviewInfo.packageId }).exec();
    if (!reviewRegistered) {
      throw new HttpException('REVIEWS.ADDUNLIKE.REVIEW_NOT_FOUND', HttpStatus.NOT_FOUND);
    } else {
      let { like, unLike } = reviewRegistered;
      let contain = false;
      unLike.forEach(item => {
        if(item === _id) {
          contain = true;
        }
      })
      if (!contain) {
        unLike.push(_id);
      }
      const index = like.indexOf(_id);
      if (index > -1) {
        like.splice(index, 1);
      }
      reviewRegistered.like = like;
      reviewRegistered.unLike = unLike;
      await reviewRegistered.save();
      return reviewRegistered;
    }
  }

  async getAllReviews(): Promise<ReviewsInterface[]> {
    return await this.ReviewsModel.find().exec();
  }

  async getReviewsByPackageId(packageId: string): Promise<any[]> {
    const reviews =  await this.ReviewsModel.find({packageId}).populate({path: 'userId', select: { 'firstName': 1, 'lastName': 1 }}).exec();
    return reviews;
  }
}