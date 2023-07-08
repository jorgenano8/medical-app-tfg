import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Chat } from 'src/app/core/modelos/chat.model';
import { Mensaje } from 'src/app/core/modelos/mensaje.model';
import { Usuario } from 'src/app/core/modelos/usuario.model';
import { AuthService } from 'src/app/core/servicios/auth.service';
import { ChatService } from 'src/app/core/servicios/chat.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  public formGroup: FormGroup;
  public loaded:Boolean =false;
  public uidUsuario:any;
  public usuarioModel:Usuario={};
  public chatModel:Chat={};
  public listaMensajes:Mensaje[]=[];
  public uidChat:string="";

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private afAuth: AngularFireAuth
  ) {
    this.uidChat=this.route.snapshot.params['uid'];
    this.formGroup = this.formBuilder.group({
      mensaje: ['', [Validators.required]]
    });
   }

  ngOnInit() {
    this.cargarChat(this.uidChat).then(()=>{
      this.cargarUsuario();
    })
    //this.loaded=true;
  }

  async cargarChat(uidChat: string){
    this.chatService.getChat(uidChat).subscribe((infoChat)=>{
      if(infoChat){
        this.rellenarInfoChat(infoChat.data());
      }
    });
  }

  cargarUsuario(){
    this.afAuth.authState.subscribe((user) => {
      if(user){
        this.usuarioService.getUsuario(user.uid).subscribe((infoUsuario)=>{
          if(infoUsuario.data()?.uid==this.chatModel.usuario1){
            this.usuarioService.getUsuario(this.chatModel.usuario2).subscribe((infoUsuario)=>{
              this.rellenarInfoUsuario(infoUsuario.data());
            })
          }else{
            this.usuarioService.getUsuario(this.chatModel.usuario1).subscribe((infoUsuario)=>{
              this.rellenarInfoUsuario(infoUsuario.data());
            })
          }
        })
      }
    });
  }


  rellenarInfoChat(infoChat:any){
    this.chatModel.uid=infoChat.uid;
    this.chatModel.usuario1=infoChat.usuario1;
    this.chatModel.usuario2=infoChat.usuario2;
    infoChat.mensajes.forEach((mensaje: Mensaje)=>{
      this.listaMensajes.push(mensaje);
    })
  }

  rellenarInfoUsuario(infoUsuario:any){
    this.usuarioModel.uid=infoUsuario.uid;
    this.usuarioModel.nombre=infoUsuario.nombre;
    this.usuarioModel.apellidos=infoUsuario.apellidos;
    this.usuarioModel.especialidad=infoUsuario.especialidad;
  }


  enviarMensaje(){
    console.log('enviar')

  }

}
