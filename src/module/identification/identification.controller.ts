/* Nestjs Dependencies */
import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Post,
	Res,
	Headers,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

/* Other Dependencies */
import { ResponseMessage } from 'src/common/message/message.enum';
import { TidyResponse } from 'src/util/responseHelper';
import { IdentificationService } from './identification.service';
import { RequestPredictFoodDto } from './dto/predict-food.dto';

/* DTO */
// import { ExampleDTO } from './dto/example.dto'; // example DTO

@Controller('identification')
export class IdentificationController {
	constructor(private readonly identificationService: IdentificationService) {}

	@Post('predict')
	async predictFood(
		@Headers('fona-client-uid') uid: string,
		@Body() params: RequestPredictFoodDto,
	) {
		params.prepParams(uid);
		const data = await this.identificationService.predictFood(params);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK, data);
	}

	@Get()
	getHello(@Res() res: FastifyReply) {
		const data = {
			message: 'Hello World!',
		};
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK, data);
	}

	// Error handling with empty message
	@Get('error')
	getError(@Res() res: FastifyReply) {
		throw new HttpException(null, HttpStatus.BAD_REQUEST);
	}
}
