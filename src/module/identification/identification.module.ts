import { Module } from '@nestjs/common';
import { IdentificationController } from './identification.controller';
import { IdentificationService } from './identification.service';
import { GetModel } from './models/get.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([])],
	controllers: [IdentificationController],
	providers: [
		/** Services */
		IdentificationService,

		/** Models */
		GetModel,
	],
})
export class IdentificationModule {}
