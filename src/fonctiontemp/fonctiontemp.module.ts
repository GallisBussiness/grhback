import { Module } from '@nestjs/common';
import { FonctiontempService } from './fonctiontemp.service';
import { FonctiontempController } from './fonctiontemp.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fonctiontemp, FonctiontempSchema } from './entities/fonctiontemp.entity';

@Module({
  imports:[MongooseModule.forFeature([{name: Fonctiontemp.name,schema:FonctiontempSchema}])],
  controllers: [FonctiontempController],
  providers: [FonctiontempService],
})
export class FonctiontempModule {}
