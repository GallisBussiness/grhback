import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors,UploadedFile,HttpException } from '@nestjs/common';
import { EmployeService } from './employe.service';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, unlinkSync } from 'fs';
import { v4 as uuidv4, v4 } from 'uuid';

@Controller('employe')
export class EmployeController {
  constructor(private readonly employeService: EmployeService) {}


  @Post()
  @UseInterceptors(FileInterceptor('profile'))
  create(@UploadedFile() profile: Express.Multer.File,@Body() createEmployeDto: CreateEmployeDto) {
    if(profile){
      createEmployeDto.profile  = profile.filename;
    }
    return this.employeService.create(createEmployeDto);
  }

  @Get()
  findAll() {
    return this.employeService.findAll();
  }

  @Get("bycode/:code")
  findByCode(@Param('code') code: string) {
    return this.employeService.findByCode(code);
  }

  @Get("bymatsolde/:mat")
  findByMat(@Param('mat') mat: string) {
    return this.employeService.findByMat(mat);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeService.findOne(id);
  }

  @Post('updatecode')
  async updateAllCode() {
    const employes = await this.findAll();
    employes.forEach(async (e) => {
      if(!e.code){
        await this.employeService.update(e._id,{code: v4()})
      }
    })
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeDto: UpdateEmployeDto) {
    return this.employeService.update(id, updateEmployeDto);
  }

  @Patch('profile/:id')
  @UseInterceptors(FileInterceptor('profile'))
  async updateProfile(@UploadedFile() profile: Express.Multer.File,@Param('id') id: string,@Body() updateEmployeDto: UpdateEmployeDto) {
    if(profile){
      updateEmployeDto.profile  = profile.filename;
      const em = await this.employeService.update(id,updateEmployeDto);
      if(em && existsSync("uploads/profiles/" + em.profile)){
        unlinkSync("uploads/profiles/" + em.profile);
      }
      return em;
    }
   throw new HttpException("Profile Non Uploade !!",500);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeService.remove(id);
  }
}
