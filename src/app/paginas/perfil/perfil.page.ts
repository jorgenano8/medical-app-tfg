import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/servicios/auth.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router,) { }

  ngOnInit() {

  }

  logout(){
    this.authService.logout().then(()=>{
      this.router.navigateByUrl('/login');
    }).catch((error)=>{
      console.log(error.message);
    });
  }

}
