import { Component, OnInit } from '@angular/core';
import { Chat } from 'src/app/core/modelos/chat.model';
import { ChatService } from 'src/app/core/servicios/chat.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {

  public listaChats: Chat[]=[];

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.resetPagina();
    this.cargarChats();
  }

  ionViewWillLeave(){
    this.resetPagina();
  }

  resetPagina(){
    this.listaChats=[];
  }

  cargarChats(){
    this.chatService.getMensajes().ref.where("usuario1", "==", "jorge").get().then((listaUsuario1)=>{
      listaUsuario1.forEach(chatUsuario1=>{
        this.listaChats.push(chatUsuario1.data())
      })
    }).then(()=>{
      this.chatService.getMensajes().ref.where("usuario2", "==", "jorge").get().then((listaUsuario1)=>{
        listaUsuario1.forEach(chatUsuario1=>{
          this.listaChats.push(chatUsuario1.data())
        })
    })
  })
  console.log(this.listaChats)

  }

  crearChat(){
    //EJEMPLO
    const infoPublicacion:Chat={
      usuario1:"jorge",
      usuario2:"marta"
    };

    this.chatService.newChatVacio().then((refDoc)=>{
      infoPublicacion.uid=refDoc.id;
      refDoc.set(infoPublicacion);
    })

  }



}
