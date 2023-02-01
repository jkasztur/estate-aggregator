import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { Estate } from "./entity";

@Injectable()
export class EstateService {

	constructor(
		@InjectRepository(Estate)
		private repository: Repository<Estate>
	) { }

	findAll() {
		return this.repository.find()
	}

	async add(estate: Estate) {
		await this.repository.save(estate)
	}

	async addBatch(estates: Estate[]) {
		let added = 0
		await this.repository.manager.transaction(async (manager) => {
			for (const estate of estates) {
				const exists = await manager.exists(Estate, { where: { id: estate.id } })
				if (!exists) {
					await manager.save(estate)
					added++
				} else {
					await manager.update(Estate, { id: estate.id }, estate)
				}
			}
		})
		return added
	}

	async getCount(type: string, updated_at: Date): Promise<number> {
		return this.repository.count({
			where: {
				type,
				updated_at
			}
		})
	}

	async getAvg(type: string, field: keyof Estate, updated_at: Date): Promise<number> {
		const queryBuilder = this.repository.createQueryBuilder()
		queryBuilder.select(`AVG(${field})`, 'avgPrice').where({
			type,
			updated_at
		})
		const response = await queryBuilder.getRawOne()
		return response.avgPrice
	}

	async removeDeleted(olderThan: Date) {
		return this.repository.delete({
			updated_at: LessThan(olderThan)
		})
	}
}