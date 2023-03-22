import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { readCookie } from 'src/app/utils/cookies';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  private userLogin: boolean
  private userLogin$: Subject<boolean>
  private userRoot: boolean
  private userRoot$: Subject<boolean>

  constructor() {
    this.userLogin = true
    this.userLogin$ = new Subject()
    this.userRoot = false
    this.userRoot$ = new Subject()
  }

  setUserLogin(bol:boolean):void {
    this.userLogin = bol
    this.userLogin$.next(this.userLogin)
  }

  getUserLogin():Observable<boolean> {
    return this.userLogin$.asObservable()
  }

  setUserRoot(bol:boolean):void {
    this.userRoot = bol
    this.userRoot$.next(this.userRoot)
  }

  getUserRoot():Observable<boolean> {
    return this.userRoot$.asObservable()
  }
}
