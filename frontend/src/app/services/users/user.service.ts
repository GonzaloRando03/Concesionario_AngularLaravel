import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { renewCookieSession } from 'src/app/utils/cookies';
import { Usuario, Login } from 'src/types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost:8000/api/usuario/'
  token: null | string = null

  constructor(private http: HttpClient) { }

  setToken():void {
    const userStorage: null | string = window.localStorage.getItem('user')
    if (userStorage !== null){
      this.token = JSON.parse(userStorage).token
    }
  }

  getUsuarios():Observable<any> {
    renewCookieSession()
    return this.http.get(this.url)
  }

  postUsuario(usuario:any):Observable<any> {  
    renewCookieSession()
    return this.http.post(this.url, usuario)
  }

  getComprasUser(): Observable<any> {
    renewCookieSession()
    const userStorage = window.localStorage.getItem('user')
    const id = userStorage !== null 
      ? JSON.parse(userStorage).id
      : 0
    return this.http.get(this.url+id)
  }

  updateUser(usuario:any):Observable<any> {  
    renewCookieSession()
    this.setToken()
    return this.http.put(this.url, {...usuario})
  }

  deleteUser(id:number):Observable<any> {  
    renewCookieSession()
    this.setToken()
    return this.http.delete(this.url+id)
  }

  registerUser(usuario:Usuario):Observable<any> {
    renewCookieSession()
    return this.http.post(this.url, usuario)
  }

  loginUser(usuario:Login):Observable<any> {
    renewCookieSession()
    return this.http.put(this.url+'login', usuario)
  }
}
