import { Module } from '@nestjs/common';
import { EmployeService } from './employe.service';
import { EmployeController } from './employe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Employe, EmployeSchema } from './entities/employe.entity';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/profiles');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + '-' + file.originalname,
    );
  },
});

@Module({
  imports:[
    MongooseModule.forFeature([{name: Employe.name,schema: EmployeSchema}]),
    MulterModule.register({
      storage
    })
  ],
  controllers: [EmployeController],
  providers: [EmployeService],
})
export class EmployeModule {}
