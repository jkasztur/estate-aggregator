import { Module } from '@nestjs/common';
import { CrawlerController } from '../crawler/controller';
import { CrawlerModule } from 'src/crawler/module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estate } from 'src/estate/entity';
import { Stats } from 'src/stats/entity';
import { StatsController } from 'src/stats/controller';
import { StatsModule } from 'src/stats/module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			database: 'estate',
			username: 'postgres',
			password: 'password',
			entities: [
				Estate,
				Stats
			],
			synchronize: true,
		}),
		CrawlerModule,
		StatsModule
	],
	controllers: [CrawlerController, StatsController],
})
export class AppModule { }
