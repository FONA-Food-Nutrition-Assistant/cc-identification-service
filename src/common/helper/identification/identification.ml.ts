import * as tf from '@tensorflow/tfjs-node';
import axios from 'axios';
import * as sharp from 'sharp';

export type PredictResultObj = {
	label: string;
	probability: number;
};

export class IdentificationModel {
	private modelUrl = `${process.env.IDENTIFICATION_MODEL_URL}/model.json`;
	private imgSize = 224;
	private numOfClasses = 10;

	private model: tf.GraphModel;
	private predClass: string[];

	private async loadModel() {
		try {
			this.model = await tf.loadGraphModel(this.modelUrl);
			const res = await axios.get(
				`${process.env.IDENTIFICATION_MODEL_URL}/pred-class.json`,
			);
			this.predClass = res.data;
		} catch (error) {
			throw new Error('Failed to load model');
		}
	}

	async predict(imageBuffer: Buffer): Promise<Array<PredictResultObj>> {
		await this.loadModel();

		const prepImage = await sharp(imageBuffer)
			.resize(this.imgSize, this.imgSize, {
				fit: sharp.fit.fill,
				kernel: sharp.kernel.nearest,
			})
			.toBuffer();

		const input = tf.node
			.decodeImage(prepImage, 3)
			.div(255)
			.expandDims(0)
			.reshape([-1, this.imgSize, this.imgSize, 3])
			.toFloat() as tf.Tensor3D;

		const pred = this.model.predict(input) as tf.Tensor3D;
		const result = pred.dataSync();

		const prepData = Array.from(result)
			.map((value, index) => ({
				label: this.predClass[index],
				probability: parseFloat(value.toFixed(4)),
			}))
			.sort((a, b) => b.probability - a.probability)
			.slice(0, this.numOfClasses);

		return prepData as Array<PredictResultObj>;
	}
}
