import { Column, Entity, PrimaryGeneratedColumn, } from "typeorm";

@Entity()
export class Stats {

	@PrimaryGeneratedColumn('increment')
	id: number

	@Column()
	type: string

	@Column()
	count: number

	@Column({ type: 'timestamp' })
	updated_at: Date
}