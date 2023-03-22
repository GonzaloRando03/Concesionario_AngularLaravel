import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserLoginService } from './services/loginUser/user-login.service';
import { readCookie } from './utils/cookies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'GonzaloCars'
  userLogin:boolean
  rootUser:boolean
  method=0

    constructor(
      private _userLoginService: UserLoginService,
      private toastr: ToastrService,
      private router: Router
      ){
      this.userLogin = readCookie('token') === null
      this.rootUser = false
    }


    ngOnInit(): void {
      //Subscripciones a los observables
      this._userLoginService.getUserLogin().subscribe(bool => {
        this.userLogin = bool
      })
      this._userLoginService.getUserRoot().subscribe(bool => {
        this.rootUser = bool
      })

      //Comprobación de usuario Administrador
      const userStorage:string | null = window.localStorage.getItem('user')
      if(userStorage !== null){
        this._userLoginService.setUserRoot(JSON.parse(userStorage)?.email === 'Administrador')
      }

      //Comprobación de mensaje de deslogueado
      setInterval(()=>{
        if(readCookie('token') === null && !this.userLogin){
          this._userLoginService.setUserLogin(true)
          this._userLoginService.setUserRoot(false)
          window.localStorage.removeItem('user')
          this.toastr.info('Se ha cerrado la sesión')
          this.router.navigate(['/home'])
        }
      },1000)
    }
}
