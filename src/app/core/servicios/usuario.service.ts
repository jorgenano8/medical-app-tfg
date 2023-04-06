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

  createCollection(usuario: Usuario){
    console.log(usuario);
    return this.usuarioCollection.add({...usuario});
  }

  updateCollection(id: string, info: any){
    return this.usuarioCollection.doc(id).update(info);
  }

  delete(id: string){
    return this.usuarioCollection.doc(id).delete();
  }

  createUsuario(usuario: Usuario){
    this.createCollection(usuario);
  }

}
