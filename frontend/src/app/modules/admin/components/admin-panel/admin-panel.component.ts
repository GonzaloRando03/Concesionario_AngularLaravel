import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { deleteCookieSession, renewCookieSession } from 'src/app/utils/cookies';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit{
  constructor(private router: Router){}

  ngOnInit(): void {
    renewCookieSession()
  }

  cerrarSesion():void {
    window.localStorage.removeItem('user')
    deleteCookieSession()
    this.router.navigate(['/home'])
  }
}
