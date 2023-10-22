import { Module } from '@nestjs/common';
import { ExclusionSpecifiqueService } from './exclusion-specifique.service';
import { ExclusionSpecifiqueController } from './exclusion-specifique.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExclusionSpecifique, ExclusionSpecifiqueSchema } from './entities/exclusion-specifique.entity';

@Module({
  imports:[MongooseModule.forFeature([{name: ExclusionSpecifique.name,schema: ExclusionSpecifiqueSchema}])],
  controllers: [ExclusionSpecifiqueController],
  providers: [ExclusionSpecifiqueService],
})
export class ExclusionSpecifiqueModule {}
