import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MarcasService } from 'src/app/services/marcas/marcas.service';
import { renewCookieSession } from 'src/app/utils/cookies';

@Component({
  selector: 'app-show-marcas',
  templateUrl: './show-marcas.component.html',
  styleUrls: ['./show-marcas.component.css']
})
export class ShowMarcasComponent implements OnInit{

  marcas:any

  constructor(private _marcasService: MarcasService,
              private toastr: ToastrService){
    this.marcas = []
  }

  ngOnInit(): void {
    renewCookieSession()
    this._marcasService.getMarcas().subscribe(data=>{
      this.marcas = data
    },error=>{
      this.toastr.error('Error al conseguir las marcas')
    })
  }
}
