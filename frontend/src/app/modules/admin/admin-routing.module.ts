import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { CochesComponent } from './components/coches/coches.component';
import { ComprasComponent } from './components/compras/compras.component';
import { MarcasComponent } from './components/marcas/marcas.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';


const routes: Routes = [
  { path: 'panel', component: AdminPanelComponent },
  { path: 'marcas', component: MarcasComponent },
  { path: 'coches', component: CochesComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'compras', component: ComprasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
