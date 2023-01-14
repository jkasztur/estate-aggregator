import { Controller, Get, Inject } from '@nestjs/common';
import { Crawler } from '../crawler/service';

@Controller('crawler')
export class CrawlerController {
	constructor(
		@Inject(Crawler) private readonly crawler: Crawler
	) { }

	@Get('sync')
	fetch() {
		return this.crawler.sync();
	}
}
