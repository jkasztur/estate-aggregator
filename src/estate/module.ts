import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Estate } from "./entity";
import { EstateService } from "./service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Estate])],
	exports: [EstateService],
	providers: [EstateService]
})
export class EstateModule {
}