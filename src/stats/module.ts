import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EstateModule } from "src/estate/module";
import { Stats } from "./entity";
import { StatsService } from "./service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Stats]),
		EstateModule],
	exports: [StatsService],
	providers: [StatsService]
})
export class StatsModule {
}