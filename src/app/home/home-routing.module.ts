import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path:'',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        canActivate: [AuthGuard],
        loadChildren: () => import('../paginas/inicio/inicio.module').then( m => m.InicioPageModule)
      },
      {
        path: 'crearpublicacion',
        canActivate: [AuthGuard],
        loadChildren: () => import('../paginas/crearpublicacion/crearpublicacion.module').then( m => m.CrearPublicacionPageModule)
      },
      {
        path: 'publicacion/:uid',
        canActivate: [AuthGuard],
        loadChildren: () => import('../paginas/publicacion/publicacion.module').then( m => m.PublicacionPageModule)
      },
      {
        path: 'perfil',
        canActivate: [AuthGuard],
        loadChildren: () => import('../paginas/perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: 'mensajes',
        canActivate: [AuthGuard],
        loadChildren: () => import('../paginas/mensajes/mensajes.module').then( m => m.MensajesPageModule)
      },
      {
        path: 'notificaciones',
        canActivate: [AuthGuard],
        loadChildren: () => import('../paginas/notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
