import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'setl-permission-grid',
  templateUrl: './permission-grid.component.html',
  styleUrls: ['./permission-grid.component.scss']
})
export class PermissionGridComponent implements OnInit {

    /* Imports. */
    @Input()
    dataStructure:any;

    constructor () {

    }

    ngOnInit () {

    }

}
