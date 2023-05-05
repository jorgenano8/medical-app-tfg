import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DocumentSnapshot } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/core/modelos/usuario.model';
import { AuthService } from 'src/app/core/servicios/auth.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  public usuarioModel: Usuario = {};

  slideOpts = {
    initialSlide: 1,
    speed: 400,
  };

  constructor(
    private usuarioService: UsuarioService,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router,) { }

  ngOnInit() {
    this.afAuth.onAuthStateChanged((currentUser)=>{
      if(!currentUser){ return; }
      this.usuarioService.getUsuario(currentUser?.uid).subscribe((infoUsuario) => {
        this.rellenarDatosUsuario(infoUsuario.data());
      })
    }).catch((error)=>{
      console.log(error.message);
    });

  }

  rellenarDatosUsuario(infoUsuario: any){
    this.usuarioModel.nombre = infoUsuario.nombre;
    this.usuarioModel.apellidos = infoUsuario.apellidos;
    this.usuarioModel.uid = infoUsuario.uid;
    this.usuarioModel.email = infoUsuario.email;
    this.usuarioModel.colegiado = infoUsuario.colegiado;
    this.usuarioModel.dni = infoUsuario.dni;
    this.usuarioModel.fechaRegistro = infoUsuario.fechaRegistro;
    this.usuarioModel.descripcion = infoUsuario.descripcion;
  }

  logout(){
    this.authService.logout().then(()=>{
      this.router.navigateByUrl('/login');
    }).catch((error)=>{
      console.log(error.message);
    });
  }

}
