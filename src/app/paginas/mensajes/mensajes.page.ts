import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Chat } from 'src/app/core/modelos/chat.model';
import { Usuario } from 'src/app/core/modelos/usuario.model';
import { ChatService } from 'src/app/core/servicios/chat.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {

  public listaChats: Chat[]=[];
  public listaReceptores: any[]=[];
  public userUIDLogged:any;
  public loaded: Boolean=false;

  constructor(
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private afAuth: AngularFireAuth
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.resetPagina();
    this.loaded=false;
    this.afAuth.authState.subscribe((user) => {
      if(user){
        this.userUIDLogged=user.uid;
        this.cargarChats();
      }
    });
  }

  ionViewWillLeave(){
    this.resetPagina();
  }

  resetPagina(){
    this.listaChats=[];
    this.listaReceptores=[]
    this.userUIDLogged='';
  }

  cargarChats(){
    this.chatService.getChats().ref.where("usuario1", "==", this.userUIDLogged).get().then((listaUsuario1)=>{
      listaUsuario1.forEach(chat=>{
        this.listaChats.push(chat.data())
      })
    }).then(()=>{
      this.chatService.getChats().ref.where("usuario2", "==", this.userUIDLogged).get().then((listaUsuario2)=>{
        listaUsuario2.forEach(chat=>{
          this.listaChats.push(chat.data())
        })
      })
    }).then(()=>{
        this.cargarReceptores()
    }).catch((error)=>{
      console.log(error.message);
    });
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

  cargarReceptores(){
    this.listaChats.forEach(chat=>{
      if(chat.usuario1==this.userUIDLogged){
        this.usuarioService.getUsuario(chat.usuario2).subscribe((user)=>{
          this.listaReceptores.push(user.data());
        })
      }else{
        this.usuarioService.getUsuario(chat.usuario1).subscribe((user)=>{
          this.listaReceptores.push(user.data());
        })
      }
    })
    this.loaded=true;
  }



}
