import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { MarcasComponent } from './components/marcas/marcas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CochesComponent } from './components/coches/coches.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ComprasComponent } from './components/compras/compras.component';



@NgModule({
  declarations: [
    AdminPanelComponent,
    MarcasComponent,
    CochesComponent,
    UsuariosComponent,
    ComprasComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    AdminRoutingModule
  ]
})
export class AdminModule { }
