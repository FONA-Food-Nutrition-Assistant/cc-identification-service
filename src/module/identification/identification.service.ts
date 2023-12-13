import { Injectable } from '@nestjs/common';
import { RequestPredictFoodDto } from './dto/predict-food.dto';
import { IdentificationModel } from '../../common/ml-model/identification.ml';

@Injectable()
export class IdentificationService {
	private identificationModel;

	constructor() {
		this.identificationModel = new IdentificationModel();
	}

	async predictFood(params: RequestPredictFoodDto) {
		const result = await this.identificationModel.predict(
			'https://storage.googleapis.com/fona-dev-bucket/foods/user-food-13.jpg',
		);
		return {
			message: 'Hello World!',
			data: result,
		};
	}
}
