import { Column, Entity, PrimaryGeneratedColumn, } from "typeorm";

@Entity()
export class Stats {

	@PrimaryGeneratedColumn('increment')
	id: number

	@Column()
	type: string

	@Column()
	count: number

	@Column({ type: 'float' })
	avg_price: number

	@Column({ type: 'float' })
	avg_per_meter: number

	@Column({ type: 'timestamp' })
	updated_at: Date
}