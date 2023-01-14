import { Controller, Get, Inject } from '@nestjs/common';
import { StatsService } from './service';

@Controller('stats')
export class StatsController {
	constructor(
		@Inject(StatsService)
		private readonly statsService: StatsService
	) { }

	@Get()
	async get() {
		return this.statsService.getStats()
	}
}
