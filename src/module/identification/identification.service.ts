import { Injectable } from '@nestjs/common';
import { RequestPredictFoodDto } from './dto/predict-food.dto';
import { IdentificationModel } from '../../common/helper/identification/identification.ml';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import axios from 'axios';

@Injectable()
export class IdentificationService {
	private identificationModel;

	constructor() {
		this.identificationModel = new IdentificationModel();
	}

	async predictFood(params: RequestPredictFoodDto, image: MemoryStorageFile) {
		try {
			const predictionResult = await this.identificationModel.predict(
				image.buffer,
			);

			const foodReqPrep = predictionResult.map(food => food.label).join(',');
			const foodPrep = await this.getFoodPrep(foodReqPrep, params.uid);

			return foodPrep;
		} catch (error) {
			throw error;
		}
	}

	private async getFoodPrep(foodNames: string, uid: string) {
		try {
			const res = await axios.get(
				`${process.env.FOOD_SERVICE_URL}/food/detail`,
				{
					headers: {
						'fona-client-uid': uid,
					},
					params: {
						search: foodNames,
					},
				},
			);
			return res.data.data;
		} catch (error) {
			throw new Error(error.response.data.message);
		}
	}
}
