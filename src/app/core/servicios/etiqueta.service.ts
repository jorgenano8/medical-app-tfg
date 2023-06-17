import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Etiqueta } from '../modelos/etiqueta.model';;

@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {
  private path = '/etiqueta';
  etiquetaCollection: AngularFirestoreCollection<Etiqueta>;

  constructor(private firestore: AngularFirestore) {
    this.etiquetaCollection=firestore.collection(this.path);
   }

  getEtiquetas(): AngularFirestoreCollection<Etiqueta> {
    return this.etiquetaCollection;
  }

  getEtiqueta(uid: any){
    return this.etiquetaCollection.doc(uid).get();
  }

  async newEtiqueta(uid: any, infoEtiqueta: Etiqueta){
    return await this.etiquetaCollection.doc(uid).set(infoEtiqueta);
  }

  async updateEtiqueta(uid: any, infoEtiqueta: any){
    return await this.etiquetaCollection.doc(uid).update(infoEtiqueta);
  }

  async deleteEtiqueta(uid: any){
    return await this.etiquetaCollection.doc(uid).delete();
  }

}
