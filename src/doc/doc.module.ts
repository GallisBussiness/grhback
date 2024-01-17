import { Module } from '@nestjs/common';
import { DocService } from './doc.service';
import { DocController } from './doc.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Doc, DocSchema } from './entities/doc.entity';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/documents');
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
  imports:[MongooseModule.forFeature([{name:Doc.name,schema: DocSchema}]),
  MulterModule.register({
    storage
  })
],
  controllers: [DocController],
  providers: [DocService],
})
export class DocModule {}
