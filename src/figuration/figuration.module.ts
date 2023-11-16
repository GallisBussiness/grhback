import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Figuration, FigurationSchema } from './entities/figuration.entity';

@Module({
  imports: [MongooseModule.forFeature([{name: Figuration.name,schema: FigurationSchema}])],
})
export class FigurationModule {}
