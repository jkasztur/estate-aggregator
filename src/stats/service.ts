import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EstateService } from "src/estate/service";
import { Repository } from "typeorm";
import { Stats } from "./entity";

@Injectable()
export class StatsService {
	private logger = new Logger(StatsService.name);

	constructor(
		@Inject(EstateService)
		private estateService: EstateService,
		@InjectRepository(Stats)
		private repository: Repository<Stats>
	) { }

	async createStats(timestamp: Date) {
		this.logger.log('Creating stats')
		for (const type of ['2+1', '2+kk', '3+1', '3+kk']) {
			const count = await this.estateService.getCount(type, timestamp)
			const stats: Stats = new Stats()
			stats.updated_at = timestamp
			stats.count = count
			stats.type = type
			await this.repository.save(stats)

		}
		this.logger.log('Finished stats')
	}

	async getStats(): Promise<FetchedStats> {
		const stats = await this.repository.find({
			order: {
				updated_at: 'ASC'
			}
		})
		return stats.reduce<FetchedStats>((prev, current) => {
			const { type, count, updated_at } = current
			if (!prev[type]) {
				prev[type] = {}
			}
			prev[type][updated_at.toISOString()] = count
			return prev
		}, {})
	}
}

type FetchedStats = {
	[type: string]: IndividualStats
}

type IndividualStats = Record<string, number>