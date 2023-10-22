import { Module } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Categorie, CategorieSchema } from './entities/categorie.entity';

@Module({
  imports:[MongooseModule.forFeature([{name: Categorie.name,schema: CategorieSchema}])],
  controllers: [],
  providers: [CategorieService],
})
export class CategorieModule {}
