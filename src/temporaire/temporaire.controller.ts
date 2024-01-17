import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpException } from '@nestjs/common';
import { TemporaireService } from './temporaire.service';
import { CreateTemporaireDto } from './dto/create-temporaire.dto';
import { UpdateTemporaireDto } from './dto/update-temporaire.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, unlinkSync } from 'fs';

@Controller('temporaire')
export class TemporaireController {
  constructor(private readonly temporaireService: TemporaireService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profile'))
  create(@Body() createTemporaireDto: CreateTemporaireDto) {
    return this.temporaireService.create(createTemporaireDto);
  }

  @Get()
  findAll() {
    return this.temporaireService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.temporaireService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemporaireDto: UpdateTemporaireDto) {
    return this.temporaireService.update(id, updateTemporaireDto);
  }

  @Patch('profile/:id')
  @UseInterceptors(FileInterceptor('profile'))
  async updateProfile(@UploadedFile() profile: Express.Multer.File,@Param('id') id: string,@Body() updateEmployeDto: UpdateTemporaireDto) {
    if(profile){
      updateEmployeDto.profile  = profile.filename;
      const em = await this.temporaireService.update(id,updateEmployeDto);
      if(em && existsSync("uploads/profiles/" + em.profile)){
        unlinkSync("uploads/profiles/" + em.profile);
      }
      return em;
    }
   throw new HttpException("Profile Non Uploade !!",500);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.temporaireService.remove(id);
  }
}
