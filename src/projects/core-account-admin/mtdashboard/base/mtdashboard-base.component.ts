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
  mt10xamUrl = '/account-admin/mtdashboard/mt10x-am';
  mt10xinvUrl = '/account-admin/mtdashboard/mt10x-inv';

  isMT502: boolean = false; 
  isMT10XAM: boolean = false; 
  isMT10XINV: boolean = false;

  constructor(
    protected translate: MultilingualService,
    private router: Router,
    ) {
    
   }

  ngOnInit() {
    this.isMT502 = (this.router.url.indexOf('/account-admin/mtdashboard/mt502') !== -1) ? true : false;
    this.isMT10XAM = (this.router.url.indexOf('/account-admin/mtdashboard/mt10x-am') !== -1) ? true : false;
    this.isMT10XINV = (this.router.url.indexOf('/account-admin/mtdashboard/mt10x-inv') !== -1) ? true : false;

    if (!this.isMT10XAM && !this.isMT10XINV && !this.isMT502) {
      return this.router.navigateByUrl('/account-admin/mtdashboard/mt502');
    }
  }

}
