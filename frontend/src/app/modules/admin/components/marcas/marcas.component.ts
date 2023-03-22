import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MarcasService } from 'src/app/services/marcas/marcas.service';
import { renewCookieSession } from 'src/app/utils/cookies';
import { Marca } from 'src/types';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css']
})
export class MarcasComponent implements OnInit{
  
  marcaForm: FormGroup;
  showCreateForm = false
  marcas: any
  update = false
  confirm = false
  idMarcaUse = 0
  file: any

  constructor(private _marcaService: MarcasService,
              private toastr: ToastrService,
              private fb: FormBuilder,){
    this.marcas = []
    this.marcaForm = this.fb.group({
      nombreMarca: ['', Validators.required],
      paisMarca: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getMarcas()
    renewCookieSession()
  }

  getMarcas():void {
    this._marcaService.getMarcas().subscribe(data => {
      this.marcas = data
      console.log(data)
    },error=>{
      this.toastr.error('Error en el servidor')
    })
  }

  setCreateForm(bool:boolean): void {
    if (!bool){
      this.update = false
    }
    this.showCreateForm = bool
    this.marcaForm.setValue({
      nombreMarca:'',
      paisMarca:'' 
    })
    this.idMarcaUse = 0
  }


  setUpdate(nombre:string, pais:string, id:number): void {
    this.idMarcaUse = id
    this.showCreateForm = true
    this.update = true
    this.marcaForm.setValue({
      nombreMarca:nombre,
      paisMarca:pais 
    })
  }

  setConfirm(bool:boolean, id:number): void {
    if (bool){
      this.idMarcaUse = id
    }else{
      this.idMarcaUse = 0
    }
    this.confirm = bool
  }


  deleteMarca(): void {
    this._marcaService.deleteMarca(this.idMarcaUse).subscribe(data=>{
      this.toastr.info('Marca eliminada correctamente')
      this.getMarcas()
    }, error => {
      if (error.status == 400){
        this.toastr.error('Error, operación no permitida')
      }else {
        this.toastr.error('No puedes borrar la marca la que aún tienes coches en esta. Elimina antes los coches y vuelve a borrar la marca')
      }
    })
    this.setConfirm(false,0)
  }


  sendMarca(): void { 
    const marca:Marca = {
      nombre: this.marcaForm.get('nombreMarca')?.value,
      pais: this.marcaForm.get('paisMarca')?.value
    }

    if(marca.nombre.length <= 0 || marca.pais.length <= 0){
      this.toastr.error('Todos los campos deben ser rellenados')
      return
    }

    if(this.update){
      marca.id = this.idMarcaUse
      this._marcaService.updateMarca(marca).subscribe(data=>{
        this.toastr.info('Marca actualizada con éxito')
        this.showCreateForm = false
        this.marcaForm.setValue({
          nombreMarca:'',
          paisMarca:''
        })
        this.idMarcaUse = 0
        this.getMarcas()

      },error=>{
        if (error.status == 400){
          this.toastr.error('Error, operación no permitida')
        }else {
          this.toastr.error('Ya existe una marca con ese nombre')
        }
      })
      this.update = false
    }else{
      this._marcaService.postMarca(marca).subscribe(data=>{
        this.getMarcas()
        this.toastr.info('Marca creada con éxito')
        this.showCreateForm = false
        this.marcaForm.setValue({
          nombreMarca:'',
          paisMarca:'' 
        })
      },error=>{
        if (error.status == 400){
          this.toastr.error('Error, operación no permitida')
        }else {
          this.toastr.error('Ya existe una marca con ese nombre')
        }
      })
    }
  }






  onFileSelected(event:any) {
    const file:File = event.target.files[0];
    if (file) {
        this.file =  event.target.files[0]
    }
}



}
