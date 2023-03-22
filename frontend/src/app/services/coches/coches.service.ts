import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { renewCookieSession } from 'src/app/utils/cookies';

@Injectable({
  providedIn: 'root'
})
export class CochesService {
  url = 'http://localhost:8000/api/coches/'
  token: null | string = null

  constructor(private http: HttpClient) { }

  setToken():void {
    const userStorage: null | string = window.localStorage.getItem('user')
    if (userStorage !== null){
      this.token = JSON.parse(userStorage).token
    }
  }

  getCoches():Observable<any> {
    renewCookieSession()
    return this.http.get(this.url)
  }

  postCoche(coche:any):Observable<any> {  
    renewCookieSession()
    this.setToken()
    return this.http.post(this.url, {...coche, token: this.token})
  }

  updateCoche(coche:any):Observable<any> {  
    renewCookieSession()
    this.setToken()
    return this.http.put(this.url, {...coche, token: this.token})
  }

  deleteCoche(id:number):Observable<any> {  
    renewCookieSession()
    this.setToken()
    return this.http.delete(this.url+id)
  }
}
