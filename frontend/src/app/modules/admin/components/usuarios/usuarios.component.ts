import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/users/user.service';
import { renewCookieSession } from 'src/app/utils/cookies';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  userForm: FormGroup;
  showCreateForm = false
  usuarios: any
  update = false
  confirm = false
  idUserUse = 0

  constructor(private _userService: UserService,
              private toastr: ToastrService,
              private fb: FormBuilder,){
    this.usuarios = []
    this.userForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      emailUsuario: ['', Validators.required],
      passwordUsuario: [''],
    })
  }

  ngOnInit(): void {
    this.getUsers()
    renewCookieSession()
  }

  getUsers():void {
    this._userService.getUsuarios().subscribe(data => {
      this.usuarios = data
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
    this.userForm.setValue({
      nombreUsuario:'',
      emailUsuario:'',
      passwordUsuario: '' 
    })
    this.idUserUse = 0
  }


  setUpdate(nombre:string, email:string, password:string, id:number): void {
    this.idUserUse = id
    this.showCreateForm = true
    this.update = true
    this.userForm.setValue({
      nombreUsuario:nombre,
      emailUsuario:email,
      passwordUsuario:''
    })
  }

  setConfirm(bool:boolean, id:number): void {
    if (bool){
      this.idUserUse = id
    }else{
      this.idUserUse = 0
    }
    this.confirm = bool
  }


  deleteUsuario(): void {
    this._userService.deleteUser(this.idUserUse).subscribe(data=>{
      this.toastr.info('Usuario eliminado correctamente')
      this.getUsers()
    }, error => {
      if (error.status == 400){
        this.toastr.error('Error, operación no permitida')
      }else {
        this.toastr.error('Error al borrar el usuario')
      }
    })
    this.setConfirm(false,0)
  }


  sendUser(): void { 
    const usuario:any = {
      nombre: this.userForm.get('nombreUsuario')?.value,
      email: this.userForm.get('emailUsuario')?.value
    }

    if(this.userForm.get('passwordUsuario')?.value.length > 0){
      usuario.password = this.userForm.get('passwordUsuario')?.value
    }

    if( usuario.nombre.length <= 0 || 
        usuario.email.length <= 0){
      this.toastr.error('Todos los campos deben ser rellenados')
      return
    }

    if(this.update){
      usuario.id = this.idUserUse
      this._userService.updateUser(usuario).subscribe(data=>{
        this.toastr.info('Usuario actualizado con éxito')
        this.showCreateForm = false
        this.userForm.setValue({
          nombreUsuario:'',
          emailUsuario:'',
          passwordUsuario: '' 
        })
        this.idUserUse = 0
        this.getUsers()

      },error=>{
        if (error.status == 400){
          this.toastr.error('Error, operación no permitida')
        }else {
          this.toastr.info('Usuario actualizado con éxito')
          this.showCreateForm = false
          this.userForm.setValue({
            nombreUsuario:'',
            emailUsuario:'',
            passwordUsuario: '' 
          })
          this.idUserUse = 0
          this.getUsers()       

        }
      })
      this.update = false
    }else{
      this._userService.postUsuario(usuario).subscribe(data=>{
        this.getUsers()
        this.toastr.info('Marca creada con éxito')
        this.showCreateForm = false
        this.userForm.setValue({
          nombreMarca:'',
          paisMarca:'' 
        })
      },error=>{
        if (error.status == 400){
          this.toastr.error('Error, operación no permitida')
        }else {
          this.toastr.error('Correo electrónico no válido')
        }
      })
    }
  }
}
