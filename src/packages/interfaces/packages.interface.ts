import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { DownloadInterface } from "./download.interface";
import { RatingInterface } from "./rating.interface";

export class PackagesInterface extends Document {
  @ApiProperty()
  originalname: string;

  @ApiProperty()
  name: string;
  
  @ApiProperty()
  packageId: string;
  
  @ApiProperty()
  description: string;
  
  @ApiProperty()
  publishedBy: string;
  
  @ApiProperty()
  status: string;
  
  @ApiProperty()
  categories: [string];
  
  @ApiProperty()
  tags: [string];
  
  @ApiProperty()
  livePlayers: number;
  
  @ApiProperty()
  downloads: [DownloadInterface];
  
  @ApiProperty()
  rating: RatingInterface;
  
  @ApiProperty()
  imgs: [string];
  
  @ApiProperty()
  icon: string;
}
