import * as tf from '@tensorflow/tfjs-node';
import axios from 'axios';
import { Image, createCanvas, loadImage } from 'canvas';

export class IdentificationModel {
	private modeUrl = `${process.env.IDENTIFICATION_MODEL_URL}/model.json`;
	private imgSize = 224;
	private numOfClasses = 10;

	private model: tf.GraphModel;
	private predClass: string[];

	constructor() {
		this.loadModel();
	}

	private async loadModel() {
		this.model = await tf.loadGraphModel(this.modeUrl);

		const res = await axios.get(
			`${process.env.IDENTIFICATION_MODEL_URL}/pred-class.json`,
		);
		this.predClass = res.data;
	}

	async predict(imgUrl: string) {
		const img = await loadImage(imgUrl);
		img.src = imgUrl;

		const canvas = createCanvas(this.imgSize, this.imgSize);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, this.imgSize, this.imgSize);

		const imageData = ctx.getImageData(
			0,
			0,
			this.imgSize,
			this.imgSize,
		) as ImageData;

		const imgTensor = tf.browser
			.fromPixels(imageData)
			.reshape([-1, this.imgSize, this.imgSize, 3])
			.toFloat();

		const pred = (await this.model.predict(imgTensor)) as tf.Tensor;

		const result = pred.dataSync();
		let prepData = Array.from(result).map((value, index) => ({
			label: this.predClass[index],
			value,
		}));
		prepData = prepData.sort((a, b) => b.value - a.value);
		prepData = prepData.slice(0, this.numOfClasses);

		return prepData;
	}
}
