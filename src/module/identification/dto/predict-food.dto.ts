import { IsNotEmpty } from 'class-validator';
import { BaseRequestDto } from './base.dto';

export class RequestPredictFoodDto extends BaseRequestDto {
	@IsNotEmpty()
	image: any =
		'https://storage.googleapis.com/fona-dev-bucket/foods/user-food-1.jpg';
}

export class ResponsePredictFoodDto {}
