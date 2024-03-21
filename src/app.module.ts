import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppService } from './app.service';
import { EmployeModule } from './employe/employe.module';
import { PresenceModule } from './presence/presence.module';
import { FichepresenceModule } from './fichepresence/fichepresence.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { SessionModule } from './session/session.module';
import { RubriqueModule } from './rubrique/rubrique.module';
import { SectionModule } from './section/section.module';
import { CategorieModule } from './categorie/categorie.module';
import { DivisionModule } from './division/division.module';
import { ServiceModule } from './service/service.module';
import { FonctionModule } from './fonction/fonction.module';
import { TypedocumentModule } from './typedocument/typedocument.module';
import { DocumentModule } from './document/document.module';
import { NominationModule } from './nomination/nomination.module';
import { AttributionFonctionnelleModule } from './attribution-fonctionnelle/attribution-fonctionnelle.module';
import { AttributionGlobaleModule } from './attribution-globale/attribution-globale.module';
import { AttributionIndividuelleModule } from './attribution-individuelle/attribution-individuelle.module';
import { ExclusionSpecifiqueModule } from './exclusion-specifique/exclusion-specifique.module';
import { LotModule } from './lot/lot.module';
import { BulletinModule } from './bulletin/bulletin.module';
import { RegistreModule } from './registre/registre.module';
import { TemporaireModule } from './temporaire/temporaire.module';
import { DocModule } from './doc/doc.module';
import { LotscddModule } from './lotscdd/lotscdd.module';
import { BulletinscddModule } from './bulletinscdd/bulletinscdd.module';
import { RegistrecddModule } from './registrecdd/registrecdd.module';
import { StatusModule } from './status/status.module';
import { LotstempModule } from './lotstemp/lotstemp.module';
import { RegistretempModule } from './registretemp/registretemp.module';
import { CommentaireModule } from './commentaire/commentaire.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGODB_URL'),
        autoCreate: true,
      }),
      inject: [ConfigService],
      
    }),
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get('JWT_SECRET'),
          signOptions: { expiresIn: '24h' },
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    EmployeModule, PresenceModule, FichepresenceModule,UserModule,
     SessionModule, RubriqueModule, SectionModule, 
     CategorieModule, DivisionModule, ServiceModule, 
     FonctionModule, TypedocumentModule, DocumentModule, 
     NominationModule, AttributionFonctionnelleModule,
      AttributionGlobaleModule, AttributionIndividuelleModule,
       ExclusionSpecifiqueModule, LotModule, BulletinModule, RegistreModule,
       CategorieModule,
       TemporaireModule,
       DocModule,
       LotscddModule,
       BulletinscddModule,
       RegistrecddModule,
       StatusModule,
       LotstempModule,
       RegistretempModule,
       CommentaireModule,
      ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('user/login')
      .forRoutes('*');
  }
}
