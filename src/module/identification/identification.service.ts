import { Injectable } from '@nestjs/common';
import { RequestPredictFoodDto } from './dto/predict-food.dto';

@Injectable()
export class IdentificationService {
	async predictFood(params: RequestPredictFoodDto) {
		return {
			message: 'Hello World!',
		};
	}
}
