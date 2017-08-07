import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';
    users: Array<object>;

    constructor() {
        this.users = [{
            id: 1,
            name: 'Ming',
            creation: '10/10/1993',
            color: 'red'
        }];
    }
}
