import { Injectable } from '@angular/core';
import { FieldValue, arrayUnion, doc, updateDoc, } from 'firebase/firestore';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Publicacion } from '../modelos/publicacion.model';
import { Comentario } from '../modelos/comentario.model';


@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private path = '/publicacion';
  publicacionCollection: AngularFirestoreCollection<Publicacion>;

  constructor(private firestore: AngularFirestore) {
    this.publicacionCollection=firestore.collection(this.path);
   }

  getPublicaciones(): AngularFirestoreCollection<Publicacion> {
    return this.publicacionCollection;
  }

  getPublicacion(uid: any){
    return this.publicacionCollection.doc(uid).get();
  }

  async newPublicacion(uid: any, infoPublicacion: Publicacion){
    return await this.publicacionCollection.doc(uid).set(infoPublicacion);
  }

  async newPublicacionVacia(){
    return this.publicacionCollection.doc();
  }

  async updatePublicacion(uid: any, infoPublicacion: any){
    return await this.publicacionCollection.doc(uid).update(infoPublicacion);
  }

  async deletePublicacion(uid: any){
    return await this.publicacionCollection.doc(uid).delete();
  }

  async newComentarioToPublicacion(publicacionUID: any, comentario: Comentario){
    updateDoc(doc(this.firestore.firestore, this.path + '/' + publicacionUID), {
      comentarios: arrayUnion(comentario)
    })
  }

}
