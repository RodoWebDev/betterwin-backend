import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Model, Types } from 'mongoose';
import { PackagesInterface } from './interfaces/packages.interface';
import { InjectModel } from '@nestjs/mongoose';
import { PackagesDto } from './dto/packages.dto';
import { Observable } from 'rxjs';

@Injectable()
export class PackagesExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    req.file['name'] = req.body.name;
    req.file['packageId'] = req.body.packageId;
    return next.handle();
  }
}

@Injectable()
export class PackagesService {
	constructor(
    @InjectModel('Packages') private readonly packagesModel: Model<PackagesInterface>,
	) { }

  azureConnection = process.env.AZURE_CONNECTION_STRING;
  containerName = process.env.AZURE_CONTAINER_NAME;

  getBlobClient(imageName:string):BlockBlobClient{
    const blobClientService = BlobServiceClient.fromConnectionString(this.azureConnection);
    const containerClient = blobClientService.getContainerClient(this.containerName);
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async getfileStream(fileName: string){
    const blobClient = this.getBlobClient(fileName);
    var blobDownloaded = await blobClient.download();
    return blobDownloaded.readableStreamBody;
  }

  async delete(filename: string){
    const blobClient = this.getBlobClient(filename);
    await blobClient.deleteIfExists();
  }

  async saveAppToDB(newApp: PackagesDto){
    if (newApp.name && newApp.packageId && newApp.originalname) {
      const appRegistered = await this.findByName(newApp.name);
      if (!appRegistered) {
        const tempNewApp = {
          ...newApp
        };
        const createdApp = new this.packagesModel(tempNewApp);
        return await createdApp.save();
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

  async upload(file:Express.Multer.File){
    const blobClient = this.getBlobClient(file.originalname);
    await blobClient.uploadData(file.buffer);
  }

  async findById(id: string | Types.ObjectId): Promise<PackagesInterface> {
    const _id = typeof id === 'string' ? new Types.ObjectId(id) : id;
    return await this.packagesModel.findOne({ _id }).exec();
  }

  async findByName(packageId: string): Promise<PackagesInterface> {
    return await this.packagesModel.findOne({ packageId }).exec();
  }

  async addDownload(packageId: string, id: string | Types.ObjectId): Promise<void> {
    const userId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const packageInfoFromDb =  await this.packagesModel.findOne({ packageId }).exec();
    if (!packageInfoFromDb) {
      throw new HttpException('COMMON.APK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    let { downloads } = packageInfoFromDb;
    let contain = false;
    downloads.forEach(item => {
      if(item.userId === userId) {
        contain = true;
      }
    })
    if (!contain) {
      downloads.push({userId});
    }
    packageInfoFromDb.downloads = downloads;
    await packageInfoFromDb.save();
  }

  async update(packageId: string, packageInfo: PackagesDto): Promise<PackagesInterface> {
    const packageInfoFromDb =  await this.packagesModel.findOne({ packageId }).exec();
    if (!packageInfoFromDb) {
      throw new HttpException('COMMON.APK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    packageInfoFromDb.name = packageInfo['name'];
    packageInfoFromDb.description = packageInfo['description'];
    packageInfoFromDb.publishedBy = packageInfo['publishedBy'];
    packageInfoFromDb.status = packageInfo['status'];
    packageInfoFromDb.categories = packageInfo['categories'];
    packageInfoFromDb.tags = packageInfo['tags'];
    await packageInfoFromDb.save();
    return packageInfoFromDb;
  }

  async addRating(reviewInfo: any): Promise<PackagesInterface> {
    const packageInfoFromDb =  await this.packagesModel.findOne({ packageId: reviewInfo.packageId }).exec();
    if (!packageInfoFromDb) {
      throw new HttpException('COMMON.APK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (packageInfoFromDb.rating) {
      if (reviewInfo.rating === 1) {
        packageInfoFromDb.rating.mark1 += 1;
      } else if (reviewInfo.rating === 2) {
        packageInfoFromDb.rating.mark2 += 1;
      } else if (reviewInfo.rating === 3) {
        packageInfoFromDb.rating.mark3 += 1;
      } else if (reviewInfo.rating === 4) {
        packageInfoFromDb.rating.mark4 += 1;
      } else if (reviewInfo.rating === 5) {
        packageInfoFromDb.rating.mark5 += 1;
      }
      const totalCount = packageInfoFromDb.rating.totalCount;
      packageInfoFromDb.rating.rating = packageInfoFromDb.rating.mark1 * 1 +
      packageInfoFromDb.rating.mark2 * 2 +
      packageInfoFromDb.rating.mark3 * 3 +
      packageInfoFromDb.rating.mark4 * 4 +
      packageInfoFromDb.rating.mark5 * 5 / (totalCount + 1);
      packageInfoFromDb.rating.totalCount += 1;
    } else {
      packageInfoFromDb.rating = {
        rating: reviewInfo.rating,
        totalCount: 1,
        mark1: reviewInfo.rating === 1 ? 1 : 0,
        mark2: reviewInfo.rating === 2 ? 1 : 0,
        mark3: reviewInfo.rating === 3 ? 1 : 0,
        mark4: reviewInfo.rating === 4 ? 1 : 0,
        mark5: reviewInfo.rating === 5 ? 1 : 0
      }
    }
    await packageInfoFromDb.save();
    return packageInfoFromDb;
  }

  async addLivePlayers(packageId: string, email: string): Promise<PackagesInterface> {
    const packageInfoFromDb =  await this.packagesModel.findOne({ packageId }).exec();
    if (!packageInfoFromDb) {
      throw new HttpException('COMMON.APK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (packageInfoFromDb.livePlayers) {
      packageInfoFromDb.livePlayers += 1;
    } else {
      packageInfoFromDb.livePlayers = 1;
    }
    await packageInfoFromDb.save();
    return packageInfoFromDb;
  }

  async removeLivePlayers(packageId: string, email: string): Promise<PackagesInterface> {
    const packageInfoFromDb =  await this.packagesModel.findOne({ packageId }).exec();
    if (!packageInfoFromDb) {
      throw new HttpException('COMMON.APK_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (packageInfoFromDb.livePlayers) {
      packageInfoFromDb.livePlayers -= 1;
    } else {
      packageInfoFromDb.livePlayers = 0;
    }
    await packageInfoFromDb.save();
    return packageInfoFromDb;
  }

  async deleteOrder(id: string): Promise<PackagesInterface> {
    return await this.packagesModel.findByIdAndRemove(id);
  }

  async getAllPackages(): Promise<PackagesInterface[]> {
    return await this.packagesModel.find().exec();
  }

  async getSearchedPacakges(keyword: string): Promise<PackagesInterface[]> {
    const response = await this.packagesModel.find().exec();
    return response.filter((item: PackagesInterface) => item['name'].toLowerCase().includes(keyword.toLowerCase()));
  }

  async getSearchedPacakgesFromStore(keyword: string, category: string): Promise<PackagesInterface[]> {
    if (keyword && category) {
      const response = await this.packagesModel.find().exec();
      return response.filter((item: PackagesInterface) => item['name'].toLowerCase().includes(keyword.toLowerCase()) && item['categories'].includes(category));
    }
    throw new HttpException('COMMON.APK_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}