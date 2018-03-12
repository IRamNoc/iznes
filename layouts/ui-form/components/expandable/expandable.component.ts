import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'app-ui-layouts-expandable',
    templateUrl: './expandable.component.html',
})
export class UiExpandableComponent {

    panels = {
        1: true,
        2: true,
        3: false,
        4: false,
        5: false,
        6: false
    };

    constructor() {
    }

}
