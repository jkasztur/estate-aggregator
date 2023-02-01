import { Module } from "@nestjs/common";
import { EstateModule } from "src/estate/module";
import { StatsModule } from "src/stats/module";
import { CrawlerCron } from "./cron";
import { Crawler } from "./service";

@Module({
	imports: [EstateModule, StatsModule],
	exports: [Crawler],
	providers: [Crawler, CrawlerCron]
})
export class CrawlerModule {
}