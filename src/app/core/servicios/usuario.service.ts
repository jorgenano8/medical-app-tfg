import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Usuario } from '../modelos/usuario.model';
import { FieldValue, arrayUnion, arrayRemove, doc, updateDoc, } from 'firebase/firestore';
import firebase from 'firebase/compat';

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

  async updateUsuarioSeguir(userUIDlogged: any, followUIDuser:any){
    updateDoc(doc(this.firestore.firestore, 'usuario/' + userUIDlogged), {
      seguidos: arrayUnion(followUIDuser)
    })
  }

  async updateUsuarioNuevoSeguidor(userUIDlogged: any, followUIDuser:any){
    updateDoc(doc(this.firestore.firestore, 'usuario/' + followUIDuser), {
      seguidores: arrayUnion(userUIDlogged)
    })
  }

  async updateUsuarioDejarSeguir(userUIDlogged: any, followUIDuser:any){
    updateDoc(doc(this.firestore.firestore, 'usuario/' + userUIDlogged), {
      seguidos: arrayRemove(followUIDuser)
    })
  }

  async updateUsuarioEliminarSeguidor(userUIDlogged: any, followUIDuser:any){
    updateDoc(doc(this.firestore.firestore, 'usuario/' + followUIDuser), {
      seguidores: arrayRemove(userUIDlogged)
    })
  }

  async deleteUsario(uid: any){
    return await this.usuarioCollection.doc(uid).delete();
  }

}
