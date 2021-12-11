import { ApiProperty } from "@nestjs/swagger";

export class RatingInterface {
  @ApiProperty()
  rating: number;

  @ApiProperty()
  totalCount: number;
  
  @ApiProperty()
  mark1: number;
  
  @ApiProperty()
  mark2: number;
  
  @ApiProperty()
  mark3: number;
  
  @ApiProperty()
  mark4: number;
  
  @ApiProperty()
  mark5: number;
}
