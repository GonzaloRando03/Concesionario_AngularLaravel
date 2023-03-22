import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ShowCochesComponent } from './components/show-coches/show-coches.component';
import { ShowMarcasComponent } from './components/show-marcas/show-marcas.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { WebMapComponent } from './components/web-map/web-map.component';
import { AdminComponent } from './modules/admin/admin.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'me', component: UsuarioComponent },
  { path: 'coches', component: ShowCochesComponent },
  { path: 'marcas', component: ShowMarcasComponent },
  { path: 'web', component: WebMapComponent },
  {
    path: 'admin',
    component: AdminComponent,
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
  },
  /* router para cualquier ruta que no este en las especificadas */
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
