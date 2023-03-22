import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { readCookie } from 'src/app/utils/cookies';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{

  constructor(private router: Router){
  }

  ngOnInit(): void {
    const userStorage:string | null = window.localStorage.getItem('user')
    if(userStorage !== null){
      const tokenCookie:string | null = readCookie('token')
      if (tokenCookie === null || JSON.parse(userStorage).email !== 'Administrador'){
        this.router.navigate(['/home']) 
      }

    }else{
      this.router.navigate(['/home'])
    }
    
  }
}
