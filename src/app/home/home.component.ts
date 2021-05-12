import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../shared/general.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private generalService: GeneralService, public router: Router) { }

  ngOnInit(): void {
    this.generalService.redirectToChat();
  }

}
