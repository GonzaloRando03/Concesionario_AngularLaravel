import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { renewCookieSession } from 'src/app/utils/cookies';
import { Marca } from 'src/types';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {
  url = 'http://localhost:8000/api/marcas/'
  token: null | string = null

  constructor(private http: HttpClient) { }

  setToken():void {
    const userStorage: null | string = window.localStorage.getItem('user')
    if (userStorage !== null){
      this.token = JSON.parse(userStorage).token
    }
  }

  getMarcas():Observable<any> {
    renewCookieSession()
    return this.http.get(this.url)
  }

  postMarca(marca:Marca):Observable<any> {  
    renewCookieSession()
    this.setToken()
    return this.http.post(this.url, {...marca, token: this.token})
  }

  updateMarca(marca:Marca):Observable<any> {  
    renewCookieSession()
    this.setToken()
    return this.http.put(this.url, {...marca, token: this.token})
  }

  deleteMarca(id:number):Observable<any> {  
    renewCookieSession()
    this.setToken()
    return this.http.delete(this.url+id)
  }
}
