import { Component, OnInit } from '@angular/core';
import { MultilingualService } from '@setl/multilingual';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mtdashboard-base',
  templateUrl: './mtdashboard-base.component.html',
  styleUrls: ['./mtdashboard-base.component.scss']
})
export class MtdashboardBaseComponent implements OnInit {
  
  mt502Url = '/account-admin/mtdashboard/mt502';
  mt10xamUrl = '/account-admin/mtdashboard/mt10x';

  isMT502: boolean = false; 
  isMT10XAM: boolean = false; 

  constructor(
    protected translate: MultilingualService,
    private router: Router,
    ) {}

  ngOnInit() {
    this.isMT502 = (this.router.url.indexOf('/account-admin/mtdashboard/mt502') !== -1) ? true : false;
    this.isMT10XAM = (this.router.url.indexOf('/account-admin/mtdashboard/mt10x') !== -1) ? true : false;

    if (!this.isMT10XAM && !this.isMT502) {
      return this.router.navigateByUrl('/account-admin/mtdashboard/mt502');
    }
  }

}
