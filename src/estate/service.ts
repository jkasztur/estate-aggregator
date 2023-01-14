import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
}