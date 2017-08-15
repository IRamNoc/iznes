import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'app-navigation-topbar',
    templateUrl: './navigation-topbar.component.html',
    styleUrls: ['./navigation-topbar.component.css']
})
export class NavigationTopbarComponent implements OnInit {

    public items: Array<string> = ['Test Wallet', 'Another Wallet', 'Investment Wallet', 'Cash Wallet', 'A Really Really Long Wallet Name'];

    @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    public callToggleSidebar(event) {
        this.toggleSidebar.emit(event);
    }

    public selected(value: any): void {
        console.log('Selected value is: ', value);
    }

    public removed(value: any): void {
        console.log('Removed value is: ', value);
    }

}
