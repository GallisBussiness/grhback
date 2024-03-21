import { createWriteStream } from "fs";
import PdfPrinter from 'pdfmake';
import { Calcul } from "./calcul";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { Lotstemp } from "../entities/lotstemp.entity";
import { Temporaire } from "src/temporaire/entities/temporaire.entity";
import { Status } from "src/status/entities/status.entity";


const fonts = {
  TmesNewRoman: {
    normal: 'src/lot/helpers/font/TimesNewRoman/timesnewroman.ttf',
    bold: 'src/lot/helpers/font/TimesNewRoman/timesnewromanbold.ttf',
    italics: 'src/lot/helpers/font/TimesNewRoman/timesnewromanitalic.ttf',
    bolditalics: 'src/lot/helpers/TimesNewRoman/timesnewromanbolditalic.ttf'
  },
  Roboto: {
          normal: 'src/lot/helpers/font/roboto-font/Roboto-Regular.ttf',
          bold: 'src/lot/helpers/font/roboto-font/Roboto-Medium.ttf',
          italics: 'src/lot/helpers/font/roboto-font/Roboto-Italic.ttf',
          bolditalics: 'src/lot/helpers/roboto-font/font/Roboto-MediumItalic.ttf'
        }
};

const formatNumber = (n: number) => String(n).replace(/(.)(?=(\d{3})+$)/g,'$1 ');

export class PdfMaker {
    private printer = new PdfPrinter(fonts);

    generate(temps: Temporaire[],status: Status[],lot: Lotstemp){
      const cal2 = new Calcul();
      const {mois,annee,etat,_id} = lot;
      const wm = etat === "VALIDE" ? annee : "BROUILLON"
      const docDefinition = {
        footer: function(currentPage, pageCount) { return {text:'DANS VOTRE INTERET ET POUR VOUS AIDER A FAIRE VALOIR VOS DROITS, CONSERVER CE BULLETIN DE PAIE SANS LIMITATION DE DUREE',fontSize:8,alignment:'center', italics: true}},
        watermark: { text: `TEMPORAIRES CROUS/Z ${wm}`, color: etat === "VALIDE" ? 'grey':'red', opacity: 0.3, bold: true, italics: false },
        content:[],
        styles: {
          header: {
              color:"white",
              border: [true, true, true, true],
              fillColor: '#73BFBA',
              bold: true,
              alignment:'center',
              fontSize:8
          },
          header2: {
              alignment:'left',
              fontSize:8,
             bold:true
          },
          nombre: {
            alignment:'right',
            fontSize:8,
            bold:true
        },
           info: {
            fontSize:8,
        },
          header3: {
              color:"white",
              fillColor: '#73BFBA',
              bold: true,
              alignment:'center',
              fontSize:8
          },
          header4: {
              color:"white",
              fillColor: '#73BFBA',
              bold: true,
              alignment:'right',
              fontSize:8
          },
          total:{
              color:"white",
              bold: true,
              fontSize:8,
              fillColor:'#73BFBA',
              alignment:'center'
          },
          anotherStyle: {
            italics: true,
            alignment: 'right'
          }
        }
      }

      status.forEach(s => {
        const t = temps.filter(tm => tm.status._id.toString() === s._id.toString())
          docDefinition.content.push([
            {
              columns: [
                {
                with: '20%',
                alignment:'left',
                stack: [
                  {text:"REPUBLIQUE DU SENEGAL\n",fontSize: 8,bold: true,alignment:"center"},
                  {text:"Un Peuple, Un but, Une Foi\n",fontSize: 8,bold: true,margin:[0,2],alignment:"center"},
                  {image:'src/lotscdd/helperscdd/drapeau.jpg',width: 40,alignment:"center"},
                  {text:"MINISTERE DE L'ENSEIGNEMENT SUPERIEUR\n",fontSize: 8,bold: true,margin:[0,2],alignment:"center"},
                  {text:"DE LA RECHERCHE ET DE L'INNOVATION\n",fontSize: 8,bold: true,alignment:"center"},
                  {text:"CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES",fontSize: 8,bold: true,margin:[0,2],alignment:"center"},
                  {text:"SOCIALES DE ZIGUINCHOR",fontSize: 8,bold: true,alignment:"center"}
                ]},
                {
                  with:'20%',
                  alignment:'right',
                  stack:[
                    {image:'src/lotscdd/helperscdd/logo.png',width: 100,margin:[10,2]},
                    {text: `Du ${format(parse(lot.debut,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})} Au ${format(parse(lot.fin,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})}`,fontSize: 8,bold: true}
                  ]
                  
                }
              ]
            },
            {
              margin: [50,15],
              fillColor:"#277df5",
              alignment:'center',
              layout:'noBorders',
              table: {
                widths: [400],
                body: [
                  [ {text:`${s.nom.toUpperCase()}`,fontSize: 18,bold: true,color:'white',margin:[0,4]}],
                ]
              }
            },
          
            {
              margin: [10,0,0,10],
              layout: {
                  fillColor:(i,node) => {
                      return i % 2 === 0 ? '#00F7F7' : 'white';
                  }
              },
              table: {
                widths: [15,150,'*'],
                headerRows: 1,
              body: [
                [{text:'N°',style:'header'},{text:'Employes',style:'header'}, {text: 'Montant',style:'header'}],
                ...t.map((r,i) => ([{text:(i+1),style:'header2'},{text:`${r.prenom} ${r.nom}`,style: 'header2',border:[true,true,true,false]},{text:formatNumber(r.mensualite),style: 'nombre',border:[false,true,true,false]}]))
              ]
            }
        },
          {
            margin: [50,5],
            fillColor:"black",
            alignment:'center',
            layout:'noBorders',
            pageBreak: 'after',
            table: {
              widths: [400],
              body: [
                [ {text:`TOTAL REVENNUE ${s.nom}: ${formatNumber(cal2.getTotal(t))} FCFA`,fontSize: 8,bold: true,color:'white',margin:[0,2]}],
              ]
            }
          },
          ]);
        })
   
      const options = {};
      const pdfDoc = this.printer.createPdfKitDocument(docDefinition, options);
      pdfDoc.pipe(createWriteStream(`uploads/bulletins/temporaires/${_id}-${mois}-${annee}.pdf`));
      pdfDoc.end();
    }
}