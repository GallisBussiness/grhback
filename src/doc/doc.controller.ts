import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DocService } from './doc.service';
import { CreateDocDto } from './dto/create-doc.dto';
import { UpdateDocDto } from './dto/update-doc.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, unlinkSync } from 'fs';

@Controller('doc')
export class DocController {
  constructor(private readonly docService: DocService) {}

  @Post()
  @UseInterceptors(FileInterceptor('doc'))
  create(@UploadedFile() doc: Express.Multer.File,@Body() createDocDto: CreateDocDto) {
    if(doc){
      createDocDto.chemin  = doc.filename;
    }
    return this.docService.create(createDocDto);
  }

  @Get()
  findAll() {
    return this.docService.findAll();
  }

  @Get('byemp/:emp')
  findByEmp(@Param('emp') id: string) {
    return this.docService.findByEmp(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('doc'))
  async update(@UploadedFile() doc: Express.Multer.File,@Param('id') id: string, @Body() updateDocDto: UpdateDocDto) {
    if(doc){
      updateDocDto.chemin  = doc.filename;
    }
    const prevdoc =  await this.docService.update(id, updateDocDto);
    if(existsSync(`uploads/documents/${prevdoc.chemin}`)){
       unlinkSync(`uploads/documents/${prevdoc.chemin}`);
    }
    return prevdoc;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const prevdoc = await this.docService.remove(id);
    if(existsSync(`uploads/documents/${prevdoc.chemin}`)){
      unlinkSync(`uploads/documents/${prevdoc.chemin}`);
   }
   return prevdoc;
  }
}
