import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { renewCookieSession } from 'src/app/utils/cookies';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  url = 'http://localhost:8000/api/compras/'
  token: null | string = null

  constructor(private http: HttpClient) { }

  setToken():void {
    const userStorage: null | string = window.localStorage.getItem('user')
    if (userStorage !== null){
      this.token = JSON.parse(userStorage).token
    }
  }

  getCompras():Observable<any> {
    renewCookieSession()
    return this.http.get(this.url)
  }

  postCompra(compra:any):Observable<any> {  
    renewCookieSession()
    this.setToken()
    return this.http.post(this.url, {...compra, token: this.token})
  }

  updateCompra(compra:any):Observable<any> {  
    renewCookieSession()
    this.setToken()
    return this.http.put(this.url, {...compra, token: this.token})
  }

  deleteCompra(id:number):Observable<any> {  
    renewCookieSession()
    this.setToken()
    return this.http.delete(this.url+id)
  }
}
