import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Estate {

	@PrimaryColumn({
		type: 'bigint'
	})
	id: number

	@Column()
	name: string

	@Column()
	price: number

	@Column({ type: 'float' })
	longitude: number

	@Column({ type: 'float' })
	latitude: number

	@Column()
	type: string

	@Column()
	size: number

	@Column({ type: 'float' })
	per_meter: number

	@Column()
	link: string

	@Column({ type: 'timestamp' })
	updated_at: Date

	@Column({ type: 'jsonb' })
	attributes: any
}