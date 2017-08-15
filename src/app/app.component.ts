import {Component} from '@angular/core';
import {ToasterService} from 'angular2-toaster';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';
    users: Array<object>;
    public toasterconfig: any;

    constructor() {

    }
}
