import { Get, Inject, Injectable, Logger } from '@nestjs/common';
import { Crawler } from '../crawler/service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CrawlerCron {
	constructor(
		@Inject(Crawler) private readonly crawler: Crawler
	) { }

	@Cron('35 * * * *')
	async fetch() {
		await this.crawler.sync()
	}
}
