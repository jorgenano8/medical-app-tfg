import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FieldValue, arrayUnion, doc, updateDoc, } from 'firebase/firestore';
import { Chat } from '../modelos/chat.model';
import { Mensaje } from '../modelos/mensaje.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private path = '/chat';
  chatCollection: AngularFirestoreCollection<Chat>;

  constructor(private firestore: AngularFirestore) {
    this.chatCollection=firestore.collection(this.path);
  }

  getChats(): AngularFirestoreCollection<Chat> {
    return this.chatCollection;
  }

  getChat(uid: any){
    return this.chatCollection.doc(uid).get();
  }

  async newChat(uid: any, infoChat: Chat){
    return await this.chatCollection.doc(uid).set(infoChat);
  }

  async newChatVacio(){
    return this.chatCollection.doc().ref;
  }

  async newMensajeToChat(chatUID: any, mensaje: Mensaje){
    updateDoc(doc(this.firestore.firestore, this.path + '/' + chatUID), {
      mensajes: arrayUnion(mensaje)
    })
  }
}
