import { IsInt, Max, Min } from 'class-validator';

export class RateCocktailDto {
  @IsInt()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  value: number;
}
