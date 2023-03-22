import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CochesService } from 'src/app/services/coches/coches.service';
import { CompraService } from 'src/app/services/compras/compra.service';
import { readCookie, renewCookieSession } from 'src/app/utils/cookies';

@Component({
  selector: 'app-show-coches',
  templateUrl: './show-coches.component.html',
  styleUrls: ['./show-coches.component.css']
})
export class ShowCochesComponent implements OnInit{
  coches:any
  compras:any
  confirm = false
  idCocheUse = ''

  constructor(private _cocheService: CochesService,
              private toastr: ToastrService,
              private _compraService: CompraService){
    this.coches = []
    this.compras = []
  }

  ngOnInit(): void {
    renewCookieSession()
    this.initFuntion()
  }

  initFuntion(): void {
    this.getCoches()
    this.getCompras()

    setTimeout(()=>{
      this.coches.forEach((c:any, i:number) => {
        let bool:boolean = false
        this.compras.forEach((a:any) => {
          if(c.matricula === a.matricula_coche){
            bool = true
          }
        });
        if (bool){
          this.coches[i].estado = 'Reservado'
        }else{
          this.coches[i].estado = 'Disponible'
        }
      });
    },700)
  }

  getCoches(): void {
    this._cocheService.getCoches().subscribe(data=>{
      this.coches = data
    }, error=>{
      this.toastr.error('Error al conseguir los coches')
    })
  }

  getCompras(): void {
    this._compraService.getCompras().subscribe(data=>{
      this.compras = data
    }, error=>{
      this.toastr.error('Error al conseguir los coches')
    })
  }


  setConfirm(bool:boolean, id:string): void {
    if (bool){
      this.idCocheUse = id
    }else{
      this.idCocheUse = ''
    }
    this.confirm = bool
  }

  sendCompra(): void { 
    if (readCookie('token') === null){
      this.toastr.error('Debes loguearte para poder realizar una compra')
      return
    }

    const userStorage = window.localStorage.getItem('user')

    const compra:any = {
      matricula_coche: this.idCocheUse,
      usuario_id: userStorage !== null
        ? parseInt(JSON.parse(userStorage).id)
        : 0 
    }

    this._compraService.postCompra(compra).subscribe(data=>{
      this.getCoches()
      this.toastr.info('Compra realizada con éxito')
    },error=>{
      if (error.status == 400){
        this.toastr.error('Necesitar estar registrado para realizar esta acción')
      }else {
        this.toastr.error('El coche no está disponible o no se ha matriculado')
      }
    })
    
  }
}
