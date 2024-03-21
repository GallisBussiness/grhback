export class Calcul {
   getTotal(a){
    return a.reduce((acc,cur) => acc + cur.mensualite,0);
   }
}