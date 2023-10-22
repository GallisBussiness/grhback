import { Module } from '@nestjs/common';
import { RubriqueService } from './rubrique.service';
import { RubriqueController } from './rubrique.controller';

@Module({
  controllers: [RubriqueController],
  providers: [RubriqueService],
})
export class RubriqueModule {}
