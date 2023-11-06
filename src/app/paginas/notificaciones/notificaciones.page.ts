import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { error } from 'console';
import { Notificacion } from 'src/app/core/modelos/notificacion.model';
import { NotificacionService } from 'src/app/core/servicios/notificacion.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  public userUIDlogged: any;
  public loaded:Boolean =false;
  public listaNotificaciones: Notificacion[]=[];
  constructor(
    private notificacionService:NotificacionService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {}

  ionViewWillEnter(){
    this.resetPagina;
    this.afAuth.authState.subscribe((user) => {
      if(user){
        this.userUIDlogged = user.uid;
        this.cargarNotificaciones();
      }
    });
  }

  resetPagina(){
    this.loaded=false;
    this.listaNotificaciones=[];
  }

  cargarNotificaciones(){
    this.listaNotificaciones=[];
    this.notificacionService.getNotificaciones().ref.where("usuario", "==", this.userUIDlogged).orderBy('dateSystem', 'desc').get().then((notificaciones)=>{
      if(notificaciones){
        notificaciones.forEach(notificacion=>{
          this.listaNotificaciones.push(notificacion.data());
        })
      }
    }).then(()=>{
      this.loaded=true;
    }).catch((error)=>{
      console.log(error.message)
    })
  }

}
