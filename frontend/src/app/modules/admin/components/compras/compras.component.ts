import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CochesService } from 'src/app/services/coches/coches.service';
import { CompraService } from 'src/app/services/compras/compra.service';
import { UserService } from 'src/app/services/users/user.service';
import { renewCookieSession } from 'src/app/utils/cookies';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit{
  compraForm: FormGroup;
  showCreateForm = false
  compras: any
  coches: any
  usuarios: any
  update = false
  confirm = false
  idCompraUse = 0

  constructor(private _cocheService: CochesService,
              private _compraService: CompraService,
              private _userService: UserService,
              private toastr: ToastrService,
              private fb: FormBuilder,){
    this.compras = []
    this.usuarios = []
    this.coches = []
    this.compraForm = this.fb.group({
      matriculaCoche: ['d', Validators.required],
      idUsuario: ['d', Validators.required],
    })
  } 

  ngOnInit(): void {
    this.getCompras()
    this.getUsers()
    renewCookieSession()
    this.getCoches()
  }

  getCompras():void {
    this._compraService.getCompras().subscribe(data => {
      this.compras = data  
    },error=>{
      this.toastr.error('Error en el servidor')
    })
  }

  getCoches():void {
    this._cocheService.getCoches().subscribe(data => {

      //Filtramos los coches para que solo usemos los que están matriculados y a la venta
      const res = data.filter((c:any) => {
        let bool:boolean = true
        this.compras.forEach((e:any) => {
          if(e.matricula_coche === c.matricula || c.matricula == 'No matriculado'){
            bool = false
          }
        })
        return bool
      })

      this.coches = res
    },error=>{
      this.toastr.error('Error en el servidor')
    })
  }

  getUsers():void {
    this._userService.getUsuarios().subscribe(data => {
      this.usuarios = data
    },error=>{
      this.toastr.error('Error en el servidor')
    })
  }

  setCreateForm(bool:boolean): void {
    if (!bool){
      this.update = false
    }
    this.showCreateForm = bool
    this.compraForm.setValue({
      matriculaCoche:'d',
      idUsuario:'d' ,
    })
    this.idCompraUse = 0
  }

  setUpdate(matricula:string, id_usuario:number, id:number): void {
    this.idCompraUse = id
    this.showCreateForm = true
    this.update = true
    this.compraForm.setValue({
      matriculaCoche:matricula,
      idUsuario:id_usuario,
    })
  }

  setConfirm(bool:boolean, id:number): void {
    if (bool){
      this.idCompraUse = id
    }else{
      this.idCompraUse = 0
    }
    this.confirm = bool
  }

  deleteCompra(): void {
    this._compraService.deleteCompra(this.idCompraUse).subscribe(data=>{
      this.toastr.info('Compra eliminada correctamente')
      this.getCompras()
    }, error => {
      if (error.status == 400){
        this.toastr.error('Error, operación no permitida')
      }else {
        this.toastr.error('Error al eliminar la compra')
      }
    })
    this.setConfirm(false,0)
  }


  sendCompra(): void { 
    const compra:any = {
      matricula_coche: this.compraForm.get('matriculaCoche')?.value,
      usuario_id: this.compraForm.get('idUsuario')?.value,
    }

    if( compra.matricula_coche.length <= 0  || compra.usuario_id == 'd'){
      this.toastr.error('Todos los campos deben ser rellenados')
      return
    }

    if(this.update){
      compra.id = this.idCompraUse
      console.log(compra)
      this._compraService.updateCompra(compra).subscribe(data=>{
        this.toastr.info('Compra actualizada con éxito')
        this.showCreateForm = false
        this.compraForm.setValue({
          matriculaCoche:'d',
          idUsuario:'d'
        })
        this.idCompraUse = 0
        this.getCompras()
        this.getCoches()

      },error=>{
        if (error.status == 400){
          this.toastr.error('Error, operación no permitida')
        }else {
          this.toastr.error('Error en el servidor')
        }
      })
      this.update = false
    }else{
      this._compraService.postCompra(compra).subscribe(data=>{
        this.getCompras()
        this.getCoches()
        this.toastr.info('Compra creada con éxito')
        this.showCreateForm = false
        this.compraForm.setValue({
          matriculaCoche:'d',
          idUsuario:'d'
        })
      },error=>{
        if (error.status == 400){
          this.toastr.error('Error, operación no permitida')
        }else {
          this.toastr.error('Error en el servidor')
        }
      })
    }
  }
}
