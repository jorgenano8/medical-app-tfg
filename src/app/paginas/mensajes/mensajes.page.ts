import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Chat } from 'src/app/core/modelos/chat.model';
import { ChatService } from 'src/app/core/servicios/chat.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {

  public listaChats: Chat[]=[];
  public userUIDLogged:any;

  constructor(
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private afAuth: AngularFireAuth
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.resetPagina();
    this.afAuth.authState.subscribe((user) => {
      if(user){
        this.cargarChats(user.uid);
      }
    });
  }

  ionViewWillLeave(){
    this.resetPagina();
  }

  resetPagina(){
    this.listaChats=[];
    this.userUIDLogged='';
  }

  cargarChats(uid:any){
    this.chatService.getChats().ref.where("usuario1", "==", uid).get().then((listaUsuario1)=>{
      listaUsuario1.forEach(chatUsuario1=>{
        this.listaChats.push(chatUsuario1.data())
      })
    }).then(()=>{
      this.chatService.getChats().ref.where("usuario2", "==", uid).get().then((listaUsuario1)=>{
        listaUsuario1.forEach(chatUsuario1=>{
          this.listaChats.push(chatUsuario1.data())
        })
      })
    })
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
