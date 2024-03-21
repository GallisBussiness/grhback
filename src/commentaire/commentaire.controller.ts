import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentaireService } from './commentaire.service';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';

@Controller('commentaire')
export class CommentaireController {
  constructor(private readonly commentaireService: CommentaireService) {}

  @Post()
  create(@Body() createCommentaireDto: CreateCommentaireDto) {
    return this.commentaireService.create(createCommentaireDto);
  }

  @Get('bylot/:id')
  findOne(@Param('id') id: string) {
    return this.commentaireService.findByLot(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentaireDto: UpdateCommentaireDto) {
    return this.commentaireService.update(id, updateCommentaireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentaireService.remove(id);
  }
}
