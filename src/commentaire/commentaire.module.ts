import { Module } from '@nestjs/common';
import { CommentaireService } from './commentaire.service';
import { CommentaireController } from './commentaire.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Commentaire, CommentaireSchema } from './entities/commentaire.entity';

@Module({
  imports:[MongooseModule.forFeatureAsync([{name: Commentaire.name, useFactory: () => {
    const schema = CommentaireSchema;
    schema.plugin(require('mongoose-autopopulate'));
    return schema;
  }}])],
  controllers: [CommentaireController],
  providers: [CommentaireService],
  exports:[CommentaireService]
})
export class CommentaireModule {}
