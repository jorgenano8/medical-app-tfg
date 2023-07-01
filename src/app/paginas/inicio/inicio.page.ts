import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Publicacion } from 'src/app/core/modelos/publicacion.model';
import { AuthService } from 'src/app/core/servicios/auth.service';
import { PublicacionService } from 'src/app/core/servicios/publicacion.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  public listaPublicaciones: Publicacion[]=[];
  public uidUsuarios: any[] = [];
  public loaded :  Boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private publicacionService: PublicacionService,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router,) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.uidUsuarios=[];
    this.listaPublicaciones=[];
    this.loaded = false;
    this.cargarPublicaciones();
  }

  cargarPublicaciones(){
    this.afAuth.onAuthStateChanged((currentUser)=>{
      if(!currentUser){ return; }

      this.usuarioService.getUsuario(currentUser?.uid).subscribe((infoUsuario) => {
        this.uidUsuarios.push(currentUser.uid);
        infoUsuario.data()?.seguidos?.forEach(seguido=>{
        this.uidUsuarios.push(seguido);
        })

        this.publicacionService.getPublicaciones().ref.where('usuario', 'in', this.uidUsuarios).orderBy('dateSystem', 'desc').get().then((publicaciones)=>{
          publicaciones.forEach(publicacion=>{
            this.listaPublicaciones.push(publicacion.data());
          })
        })
        this.loaded=true;
      })
    }).catch((error)=>{
      console.log(error.message);
    });
  }
}
