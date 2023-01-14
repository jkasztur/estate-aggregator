import { Module } from "@nestjs/common";
import { EstateModule } from "src/estate/module";
import { StatsModule } from "src/stats/module";
import { Crawler } from "./service";

@Module({
	imports: [EstateModule, StatsModule],
	exports: [Crawler],
	providers: [Crawler]
})
export class CrawlerModule {
}