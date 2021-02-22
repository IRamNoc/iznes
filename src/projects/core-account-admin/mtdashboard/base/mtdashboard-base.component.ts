import { Component, OnInit } from '@angular/core';
import { MultilingualService } from '@setl/multilingual';

@Component({
  selector: 'app-mtdashboard-base',
  templateUrl: './mtdashboard-base.component.html',
  styleUrls: ['./mtdashboard-base.component.scss']
})
export class MtdashboardBaseComponent implements OnInit {

  constructor(protected translate: MultilingualService) {
    
   }

  ngOnInit() {
  }

}
