import { Component, OnInit } from '@angular/core';
import { renewCookieSession } from 'src/app/utils/cookies';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  ngOnInit(): void {
    renewCookieSession()
  }
}
