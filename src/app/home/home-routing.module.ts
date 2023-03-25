import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

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
        loadChildren: () => import('../paginas/inicio/inicio.module').then( m => m.InicioPageModule)
      },
      {
        path: 'publicacion',
        loadChildren: () => import('../paginas/publicacion/publicacion.module').then( m => m.PublicacionPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../paginas/perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: 'mensajes',
        loadChildren: () => import('../paginas/mensajes/mensajes.module').then( m => m.MensajesPageModule)
      },
      {
        path: 'notificaciones',
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
