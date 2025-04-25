import { Module } from '@nestjs/common';
import { SedesController } from './sedes.controller';
import { SedesService } from './sedes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sede } from './entity/sede.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sede])],
  controllers: [SedesController],
  providers: [SedesService],
  exports: [SedesService],
})
export class SedesModule {}
