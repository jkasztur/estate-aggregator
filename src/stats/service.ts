import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { timeStamp } from "console";
import moment from "moment";
import { EstateService } from "src/estate/service";
import { LessThan, MoreThan, Repository } from "typeorm";
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
		if (await this.statsExistToday()) {
			this.logger.log('Skip creating stats')
			return
		}
		this.logger.log('Creating stats')
		for (const type of ['2+1', '2+kk', '3+1', '3+kk']) {
			// TODO: optimize
			const stats: Stats = new Stats()
			stats.updated_at = timestamp
			stats.count = await this.estateService.getCount(type, timestamp)
			stats.type = type
			stats.avg_price = await this.estateService.getAvg(type, 'price', timestamp)
			stats.avg_per_meter = await this.estateService.getAvg(type, 'per_meter', timestamp)
			await this.repository.save(stats)
		}
		this.logger.log('Finished stats')
	}

	statsExistToday(): Promise<boolean> {
		return this.repository.exist({
			where: {
				updated_at: MoreThan(moment().startOf('day').toDate())
			}
		})
	}

	async getStats() {
		const stats = await this.repository.find({
			order: {
				updated_at: 'ASC'
			}
		})
		const reduced = stats.reduce<FetchedStats>((prev, current) => {
			const { type, count, updated_at } = current
			const date = updated_at.toISOString()
			if (!prev[date]) {
				prev[date] = {
					date: date
				}
			}
			prev[date][type] = count
			return prev
		}, {})
		return Object.values(reduced)
	}
}

type FetchedStats = {
	[date: string]: IndividualStats
}

type IndividualStats = Record<string, number | string>