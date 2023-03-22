import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Map, tileLayer } from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/users/user.service';
import { readCookie, deleteCookieSession } from 'src/app/utils/cookies';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit{
  lat = 0;
  lng = 0;
  nombre:string
  id:number
  email:string
  token:string
  coches:any
  showForm:boolean
  mailForm:FormGroup

  constructor( private router: Router,
               private toastr: ToastrService,
               private _userService: UserService,
               private fb: FormBuilder){
    this.nombre=''
    this.email=''
    this.showForm = false
    this.token=''
    this.id = 0
    this.coches = []
    this.mailForm = this.fb.group({
      email: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    const tokenCookie:string | null = readCookie('token')
    if (tokenCookie === null){
      this.router.navigate(['/home']) 
    }
    const user:string | null = window.localStorage.getItem('user')
    if (user !== null){
      const userJson = JSON.parse(user)
      this.email = userJson.email
      this.nombre = userJson.nombre
      this.token = userJson.token
      this.id = userJson.id
      let gps = userJson.gps.split(' ')
      this.lat = gps[1].slice(0,-1)
      this.lng = gps[0].substr(6,30)
    }

    this._userService.getComprasUser().subscribe(data=>{
      this.coches = data
    })
  }

  ngAfterViewInit():void{
    const map = new Map('map').setView([this.lat, this.lng], 17);
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  }

  cerrarSesion():void {
    window.localStorage.removeItem('user')
    deleteCookieSession()
    this.router.navigate(['/home'])
  }

  setShowForm(bool:boolean): void {
    this.showForm = bool
  }

  submitMail(): void {
    const usuario:any = {
      id: this.id,
      nombre: this.nombre,
      email: this.mailForm.get('email')?.value,
    }

    const mailSplit:string[] = usuario.email.split('@')
    const domainSplit:string[] = mailSplit[1].split('.')
    
    if(mailSplit.length <= 1 || domainSplit.length <= 1){
      this.toastr.error('Email no es válido')
      return
    }

    this._userService.updateUser(usuario).subscribe(data=>{
      window.localStorage.setItem('user', JSON.stringify(data))
      this.email = data.email
      this.toastr.info('E-mail cambiado con éxito')
      this.showForm = false
    },error=>{
      if (error.status == 400){
        this.toastr.error('Error, operación no permitida')
      }else {
        const userStorage = window.localStorage.getItem('user')

        const user = userStorage !== null
          ? JSON.parse(userStorage) 
          : {}

        user.email = usuario.email
        window.localStorage.setItem('user', JSON.stringify(user))
        this.email = user.email
        this.toastr.info('E-mail cambiado con éxito')       
        this.showForm = false
      }
    })
  }
}
