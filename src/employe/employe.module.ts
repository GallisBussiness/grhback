import { Module } from '@nestjs/common';
import { EmployeService } from './employe.service';
import { EmployeController } from './employe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Employe, EmployeSchema } from './entities/employe.entity';

@Module({
  imports:[MongooseModule.forFeature([{name: Employe.name,schema: EmployeSchema}])],
  controllers: [EmployeController],
  providers: [EmployeService],
})
export class EmployeModule {}
