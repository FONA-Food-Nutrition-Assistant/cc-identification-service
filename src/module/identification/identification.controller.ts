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
	UseInterceptors,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

/* Other Dependencies */
import { ResponseMessage } from 'src/common/message/message.enum';
import { TidyResponse } from 'src/util/responseHelper';
import { IdentificationService } from './identification.service';
import { RequestPredictFoodDto } from './dto/predict-food.dto';
import {
	FileInterceptor,
	MemoryStorageFile,
	UploadedFile,
} from '@blazity/nest-file-fastify';

/* DTO */

@Controller('identification')
export class IdentificationController {
	constructor(private readonly identificationService: IdentificationService) {}

	@Post('predict')
	@UseInterceptors(FileInterceptor('image'))
	async predictFood(
		@Headers('fona-client-uid') uid: string,
		@Body() params: RequestPredictFoodDto,
		@UploadedFile() image: MemoryStorageFile,
	) {
		params.prepParams(uid);
		const data = await this.identificationService.predictFood(params, image);
		return new TidyResponse(HttpStatus.OK, ResponseMessage.OK, data);
	}
}
