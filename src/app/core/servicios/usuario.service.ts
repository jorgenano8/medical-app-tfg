import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Usuario } from '../modelos/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private path = '/usuario';
  usuarioCollection: AngularFirestoreCollection<Usuario>;

  constructor(private firestore: AngularFirestore) {
    this.usuarioCollection=firestore.collection(this.path);
   }

  getAllCollection(): AngularFirestoreCollection<Usuario> {
    return this.usuarioCollection;
  }

  createCollection(uid: any, infoUsuario: Usuario){
    return this.usuarioCollection.doc(uid).set(infoUsuario);
  }

  updateCollection(uid: any, info: any){
    return this.usuarioCollection.doc(uid).update(info);
  }

  delete(uid: any){
    return this.usuarioCollection.doc(uid).delete();
  }

  crearUsuario(uid: any, infoUsuario: Usuario){
    this.createCollection(uid, infoUsuario);
  }

}
