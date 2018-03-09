import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'app-ui-layouts-expandable',
    templateUrl: './expandable.component.html',
    styles: [`        
        .well {
            background: white;
            border: 1px solid #e6e6e6;
            border-radius: 10px;
            padding: 10px;
            margin: 10px;
            overflow: auto;
        }
        .panel-header {
        a {
            color: black;
            line-height: 48px;
        }
        button {
            margin-right: 0;
        }
        .fa-chevron-down {
            transform: rotate(0deg);
            transition: transform .5s;
        &.reverse {
             transform: rotate(-180deg);
         }
        }
        }
        .panel-body {
            padding-left: 12px;
            opacity: 1;
            height: auto;
            overflow: hidden;
            transition: opacity .5s linear;
        &.hidden {
             opacity: 0;
             height: 0;
             transition: opacity .5s linear;
         }
        }`
    ]
})
export class UiExpandableComponent {

    panels = {
        1: true,
        2: true,
        3: false
    };

    constructor() {
    }

}
