import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserLoginService } from 'src/app/services/loginUser/user-login.service';
import { UserService } from 'src/app/services/users/user.service';
import { createCookieSession } from 'src/app/utils/cookies';
import { Usuario, Login } from 'src/types';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  registerForm: FormGroup
  loginForm: FormGroup

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private router: Router,
              private _userService: UserService,
              private _userLoginService: UserLoginService) {

    this.registerForm = this.fb.group({
      nombreRegister: ['', Validators.required],
      emailRegister: ['', Validators.required],
      passwordRegister: ['', Validators.required],
      repeatPasswordRegister: ['', Validators.required]
    })

    this.loginForm = this.fb.group({
      emailLogin: ['', Validators.required],
      passwordLogin: ['', Validators.required]
    })
  }

  

  sendUsuario():void {
    if (this.registerForm.get('passwordRegister')?.value !== this.registerForm.get('repeatPasswordRegister')?.value){
      this.toastr.error('Las contraseñas no son iguales')
      return
    }

    if (this.registerForm.get('nombreRegister')?.hasError('required') &&
        this.registerForm.get('emailRegister')?.hasError('required')){
      this.toastr.error('Todos los campos del formulario son obligatorios')
      return
    }

    const mailSplit:string[] = this.registerForm.get('emailRegister')?.value.split('@')
    const domainSplit:string[] = mailSplit[1].split('.')
    
    if(mailSplit.length <= 1 || domainSplit.length <= 1){
      this.toastr.error('Email no es válido')
      return
    }

    const usuario:Usuario = {
      nombre: this.registerForm.get('nombreRegister')?.value,
      email: this.registerForm.get('emailRegister')?.value,
      password: this.registerForm.get('passwordRegister')?.value
    }

    //función que se ejecuta si la hubicación del navegador está activada.
    navigator.geolocation.getCurrentPosition((e)=>{
      const gps:string = `ST_PointFromText('POINT(${e.coords.longitude} ${e.coords.latitude})', 0)`
      usuario.gps = gps

      try {
        this._userService.registerUser(usuario).subscribe(data => {
          createCookieSession(data.token)
          window.localStorage.setItem('user', JSON.stringify(data))
          this._userLoginService.setUserLogin(false)
          this.toastr.success('Usuario creado con éxito')
          this.router.navigate(['/home'])
        },error=>{
          if (error.status == 422){
            this.toastr.error('Este e-mail ya está en uso')
          }else {
            this.toastr.error('Error al crear el usuario')
          }
        })
      } catch (error) {
        this.toastr.error('Error al crear el usuario')
      }
    });

    //función que se ejecuta si la hubicación del navegador está desactivada.
    if (!navigator.geolocation){
      this.toastr.info('Has desactivado la localización, actívala para disfrutar de un mejor servicio.')
      try {
        this._userService.registerUser(usuario).subscribe(data => {
          createCookieSession(data.token)
          window.localStorage.setItem('user', JSON.stringify(data))
          this._userLoginService.setUserLogin(false)
          this.toastr.success('Usuario creado con éxito')
          this.router.navigate(['/home'])
        },error=>{
          if (error.status == 422){
            this.toastr.error('Este e-mail ya está en uso')
          }else {
            this.toastr.error('Error al crear el usuario')
          }
        })
      } catch (error) {
        this.toastr.error('Error al crear el usuario')
      }
    }
  }

  
  loginUser():void {
    if (this.loginForm.get('passwordLogin')?.hasError('required') ||
        this.loginForm.get('emailLogin')?.hasError('required')){
      this.toastr.error('Todos los campos del formulario son obligatorios')
      return
    }

    const mailSplit:string[] = this.loginForm.get('emailLogin')?.value.split('@')
    const domainSplit:string[] = mailSplit[1]?.split('.')
    
    if((mailSplit.length <= 1 || domainSplit.length <= 1) && this.loginForm.get('emailLogin')?.value !== 'Administrador' ){
      this.toastr.error('Email no es válido')
      return
    }

    const usuario:Login = {
      email: this.loginForm.get('emailLogin')?.value,
      password: this.loginForm.get('passwordLogin')?.value
    }

    try {
      this._userService.loginUser(usuario).subscribe(data => {
        createCookieSession(data.token)
        window.localStorage.setItem('user', JSON.stringify(data))
        this._userLoginService.setUserLogin(false)
        if (data.email === 'Administrador' && data.nombre === 'Administrador'){
          this._userLoginService.setUserRoot(true)
        }
        this.toastr.success('Usuario identificado con éxito')
        this.router.navigate(['/home'])
      },error => {
        if (error.status == 401){
          this.toastr.error('Error, contraseña incorrecta')
        }else {
          this.toastr.error('Error, correo no existente')
        }
      })
    } catch (error) {
      this.toastr.error('Error al loguearse')
    }
    
  }
}
