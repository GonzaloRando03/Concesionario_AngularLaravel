import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CochesService } from 'src/app/services/coches/coches.service';
import { MarcasService } from 'src/app/services/marcas/marcas.service';
import { renewCookieSession } from 'src/app/utils/cookies';

@Component({
  selector: 'app-coches',
  templateUrl: './coches.component.html',
  styleUrls: ['./coches.component.css']
})
export class CochesComponent implements OnInit{

  cocheForm: FormGroup;
  showCreateForm = false
  coches: any
  marcas: any
  update = false
  confirm = false
  idCocheUse = 0

  constructor(private _cocheService: CochesService,
              private _marcaService: MarcasService,
              private toastr: ToastrService,
              private fb: FormBuilder,){
    this.marcas = []
    this.coches = []
    this.cocheForm = this.fb.group({
      matriculaCoche: [''],
      modeloCoche: ['', Validators.required],
      precioCoche: ['', Validators.required],
      marcaCoche: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.getCoches()
    this.getMarcas()
    renewCookieSession()
  }

  getMarcas():void {
    this._marcaService.getMarcas().subscribe(data => {
      this.marcas = data
      console.log(this.marcas)
    },error=>{
      this.toastr.error('Error en el servidor')
    })
  }

  getCoches():void {
    this._cocheService.getCoches().subscribe(data => {
      this.coches = data
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
    this.cocheForm.setValue({
      matriculaCoche:'',
      modeloCoche:'' ,
      precioCoche: '',
      marcaCoche: 'd'
    })
    this.idCocheUse = 0
  }

  setUpdate(matricula:string, modelo:string, marca:number, id:number, precio:number): void {
    this.idCocheUse = id
    this.showCreateForm = true
    this.update = true
    this.cocheForm.setValue({
      matriculaCoche:matricula,
      modeloCoche:modelo,
      marcaCoche:marca,
      precioCoche:precio
    })
  }

  setConfirm(bool:boolean, id:number): void {
    if (bool){
      this.idCocheUse = id
    }else{
      this.idCocheUse = 0
    }
    this.confirm = bool
  }

  deleteMarca(): void {
    this._cocheService.deleteCoche(this.idCocheUse).subscribe(data=>{
      this.toastr.info('Coche eliminado correctamente')
      this.getCoches()
    }, error => {
      if (error.status == 400){
        this.toastr.error('Error, operación no permitida')
      }else {
        this.toastr.error('Error al eliminar el coche')
      }
    })
    this.setConfirm(false,0)
  }


  sendMarca(): void { 
    const coche:any = {
      matricula: this.cocheForm.get('matriculaCoche')?.value,
      modelo: this.cocheForm.get('modeloCoche')?.value,
      precio: this.cocheForm.get('precioCoche')?.value,
      marca_id: parseInt(this.cocheForm.get('marcaCoche')?.value),
    }

    if(coche.matricula.length !== 0){
      const regex = /[0-9][0-9][0-9][0-9][A-Z][A-Z][A-Z]/g;
      const found = coche.matricula.match(regex);
      if (found?.length !== 1 || found === null){
        this.toastr.error('La matrícula no es válida')
        return
      }
    }
    
    if( coche.modelo.length <= 0 || 
        coche.precio <= 0 ||
        coche.marca_id == 'd'){
      this.toastr.error('Todos los campos deben ser rellenados')
      return
    }

    if(this.update){
      coche.id = this.idCocheUse
      this._cocheService.updateCoche(coche).subscribe(data=>{
        this.toastr.info('Coche actualizado con éxito')
        this.showCreateForm = false
        this.cocheForm.setValue({
          matriculaCoche:'',
          modeloCoche:'',
          marcaCoche:'d',
          precioCoche:''
        })
        this.idCocheUse = 0
        this.getCoches()

      },error=>{
        if (error.status == 400){
          this.toastr.error('Error, operación no permitida')
        }else {
          this.toastr.error('Ya existe un coche con esa matrícula')
        }
      })
      this.update = false
    }else{
      this._cocheService.postCoche(coche).subscribe(data=>{
        this.getCoches()
        this.toastr.info('Coche creado con éxito')
        this.showCreateForm = false
        this.cocheForm.setValue({
          matriculaCoche:'',
          modeloCoche:'',
          marcaCoche:'d',
          precioCoche:''
        })
      },error=>{
        if (error.status == 400){
          this.toastr.error('Error, operación no permitida')
        }else {
          this.toastr.error('Ya existe un coche con esa matrícula')
        }
      })
    }
  }
}
