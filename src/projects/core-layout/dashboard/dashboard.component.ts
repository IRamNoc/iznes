import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
    @Input() rows: number;
    @Input() columns: number;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
    }

    gridTemplate() {
        return this.sanitizer.bypassSecurityTrustStyle(`grid-template: repeat(${ this.rows }, 1fr) / repeat(${ this.columns }, 1fr);`).toString();
    }
}
