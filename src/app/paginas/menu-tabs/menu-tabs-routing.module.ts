import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuTabsPage } from './menu-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: MenuTabsPage,
    children: [
      {
        path:'',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'publicacion',
        loadChildren: () => import('../publicacion/publicacion.module').then( m => m.PublicacionPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: 'mensajes',
        loadChildren: () => import('../mensajes/mensajes.module').then( m => m.MensajesPageModule)
      },
      {
        path: 'notificaciones',
        loadChildren: () => import('../notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuTabsPageRoutingModule {}
