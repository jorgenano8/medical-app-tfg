import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'menu-tabs',
    pathMatch: 'full'
  },
  {
    path: 'menu-tabs',
    loadChildren: () => import('./paginas/menu-tabs/menu-tabs.module').then( m => m.MenuTabsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
