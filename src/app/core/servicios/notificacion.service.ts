import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Notificacion } from '../modelos/notificacion.model';import { Usuario } from '../modelos/usuario.model';
;

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private path = '/notifiacion';
  notifiacionCollection: AngularFirestoreCollection<Notificacion>;

  constructor(private firestore: AngularFirestore) {
    this.notifiacionCollection=firestore.collection(this.path);
   }

  getNotificaciones(): AngularFirestoreCollection<Notificacion> {
    return this.notifiacionCollection;
  }

  getNotificacion(uid: any){
    return this.notifiacionCollection.doc(uid).get();
  }

  async newNotificacionPublicacion(usuarioCreador: Usuario, userUIDreceptor: any){
    const infoNotificacion:Notificacion={
      fecha: new Date().toLocaleString(),
      dateSystem: new Date(),
      contenido: "¡" + usuarioCreador.nombre + " " + usuarioCreador.apellidos +  " ha realizado una nueva publicación!",
      usuario: userUIDreceptor
    }

    let uidNotificacion=this.notifiacionCollection.doc().ref.id;
    infoNotificacion.uid=uidNotificacion;
    this.notifiacionCollection.doc(uidNotificacion).set(infoNotificacion);
  }

  async updateNotificacion(uid: any, infoNotifiacion: any){
    return await this.notifiacionCollection.doc(uid).update(infoNotifiacion);
  }

  async deleteNotificacion(uid: any){
    return await this.notifiacionCollection.doc(uid).delete();
  }

}
