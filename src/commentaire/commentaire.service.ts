import { HttpException, Injectable } from '@nestjs/common';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';
import { AbstractModel } from 'src/utils/abstractmodel';
import { Commentaire, CommentaireDocument } from './entities/commentaire.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommentaireService extends AbstractModel<Commentaire,CreateCommentaireDto,UpdateCommentaireDto>{
 constructor(@InjectModel(Commentaire.name) private readonly commentaireModel: Model<CommentaireDocument>){
  super(commentaireModel);
 }

 async findByLot(id: string): Promise<Commentaire[]> {
    try {
     return await this.commentaireModel.find({lot: id})
    } catch (error) {
     throw new HttpException(error.message,500);
    }
 }
}
