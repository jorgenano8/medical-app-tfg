import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
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

  getUsuarios(): AngularFirestoreCollection<Usuario> {
    return this.usuarioCollection;
  }

  getUsuario(uid: any){
    return this.usuarioCollection.doc(uid).get();
  }

  async newUsuario(uid: any, infoUsuario: Usuario){
    return await this.usuarioCollection.doc(uid).set(infoUsuario);
  }

  async updateUsuario(uid: any, infoUsuario: any){
    return await this.usuarioCollection.doc(uid).update(infoUsuario);
  }

  async deleteUsario(uid: any){
    return await this.usuarioCollection.doc(uid).delete();
  }

}