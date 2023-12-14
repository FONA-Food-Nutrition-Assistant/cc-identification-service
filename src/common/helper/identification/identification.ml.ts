import * as tf from '@tensorflow/tfjs-node';
import axios from 'axios';
import * as sharp from 'sharp';

export class IdentificationModel {
	private modeUrl = `${process.env.IDENTIFICATION_MODEL_URL}/model.json`;
	private imgSize = 224;
	private numOfClasses = 10;

	private model: tf.GraphModel;
	private predClass: string[];

	private async loadModel() {
		try {
			this.model = await tf.loadGraphModel(this.modeUrl);
			const res = await axios.get(
				`${process.env.IDENTIFICATION_MODEL_URL}/pred-class.json`,
			);
			this.predClass = res.data;
		} catch (error) {
			throw new Error('Failed to load model');
		}
	}

	async predict(imageBuffer: Buffer) {
		await this.loadModel();

		const prepImage = await sharp(imageBuffer)
			.resize(this.imgSize, this.imgSize, {
				fit: sharp.fit.contain,
				background: { r: 255, g: 255, b: 255, alpha: 1 },
			})
			.toBuffer();

		const input = tf.node
			.decodeImage(prepImage, 3)
			.reshape([-1, this.imgSize, this.imgSize, 3])
			.toFloat();

		const pred = this.model.predict(input) as tf.Tensor;
		const result = pred.dataSync();

		const prepData = Array.from(result)
			.map((value, index) => ({
				label: this.predClass[index],
				probability: parseFloat(value.toFixed(4)),
			}))
			.sort((a, b) => b.probability - a.probability)
			.slice(0, this.numOfClasses);

		return prepData;
	}
}