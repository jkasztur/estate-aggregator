import { Inject, Injectable, Logger } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { Estate } from 'src/estate/entity'
import { EstateService } from 'src/estate/service'
import { StatsService } from 'src/stats/service'

const params = {
	category_main_cb: 1, // byty
	category_type_cb: 1, // prodej
	locality_region_id: 14, // JM kraj
	locality_district_id: 72, // Brno
	per_page: 500
}

@Injectable()
export class Crawler {
	private client: AxiosInstance
	private logger = new Logger(Crawler.name);

	constructor(
		@Inject(EstateService)
		private estateService: EstateService,
		@Inject(StatsService)
		private statsService: StatsService
	) {
		this.client = axios.create({
			baseURL: 'https://www.sreality.cz',
		})
	}

	async sync() {
		try {
			this.logger.log('Sync started')
			const results = await this.syncInternal()
			this.logger.log('Sync finished')
			return results
		} catch (err) {
			this.logger.error({ err })
		}
	}

	private async syncInternal() {
		let page = 0
		let totalFound = 0
		let totalAdded = 0
		const updatedAt = new Date()
		while (true) { // leave only true
			const results = await this.client.get('/api/cs/v2/estates', {
				params: {
					...params,
					page: page++,
					tms: new Date().getTime()
				}
			})
			const items: Estate[] = (await Promise.all<Estate>(results.data._embedded.estates.map(item => this.getDetail(item))))
				.filter(item => !!item)
				.map(item => {
					item.updated_at = updatedAt
					return item
				})
			if (items.length === 0) {
				break
			}
			totalFound += items.length
			totalAdded += await this.estateService.addBatch(items)
		}
		this.logger.log(`Found ${totalFound} estates`)
		this.logger.log(`Added ${totalAdded} new estates to DB`)
		await this.statsService.createStats(updatedAt)
		return { totalFound, totalAdded }
	}

	private async getDetail(rawItem: any): Promise<Estate> {
		const estate: Estate = this.mapItem(rawItem)
		if (!estate) return null
		const result = await this.client.get(`/api/cs/v2/estates/${estate.id}`, {
			params: {
				tms: new Date().getTime()
			}
		})
		const attributes = result.data.items.filter(attribute => attribute.type === 'string'
			|| attribute.type === 'number'
			|| attribute.type === 'boolean')
		estate.attributes = attributes
		return estate
	}

	private mapItem(item: any): Estate {
		const estate = new Estate()
		estate.id = item.hash_id
		estate.name = item.name
		estate.latitude = item.gps.lat
		estate.longitude = item.gps.lon
		estate.price = item.price
		estate.link = `https://www.sreality.cz/detail/prodej/byt/x/y/${estate.id}`
		const parsed = this.parseName(item.name)
		//this.logger.log({ name: item.name, type, size })
		if (!parsed || estate.price <= 1) {
			return null
		}
		estate.type = parsed.type
		estate.size = parsed.size
		estate.per_meter = estate.price / estate.size
		return estate
	}

	private parseName(name: string): { type: string, size: number } {
		const items = name.split(/\s+/)
		const typeIndex = items.findIndex((item) => item.includes('+') || item.includes('atypické'))
		let size = Number.parseInt(items[typeIndex + 1])
		if (!size) {
			return null
		}
		return {
			type: items[typeIndex],
			size,
		}
	}
}
