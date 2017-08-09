import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basic-layout',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicLayoutComponent implements OnInit {

  constructor (
      private router:Router,
  ) {
      /* Stub. */
  }

  ngOnInit() {
  }

}
