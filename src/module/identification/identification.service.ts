import { Injectable } from '@nestjs/common';
import { RequestPredictFoodDto } from './dto/predict-food.dto';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import axios from 'axios';

import {
	IdentificationModel,
	PredictResultObj,
} from '../../common/helper/identification/identification.ml';

type FoodPrepObj = {
	id: number;
	name: string;
	is_user_allergy: boolean;
	nutritions: Array<any>;
};

@Injectable()
export class IdentificationService {
	private identificationModel;

	constructor() {
		this.identificationModel = new IdentificationModel();
	}

	async predictFood(params: RequestPredictFoodDto, image: MemoryStorageFile) {
		try {
			const predictionResult: Array<PredictResultObj> =
				await this.identificationModel.predict(image.buffer);

			const foodReqPrep = predictionResult.map(food => food.label).join(',');
			const foodPrep = await this.getFoodPrep(foodReqPrep, params.uid);

			const data = foodReqPrep.split(',').reduce((acc, currFood) => {
				const temp = foodPrep.filter(foodPrep =>
					foodPrep.name.toLowerCase().includes(currFood),
				);
				acc.push(...temp);
				return acc;
			}, []);

			return data;
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
			return res.data.data as Array<FoodPrepObj>;
		} catch (error) {
			throw new Error(error.response.data.message);
		}
	}
}
