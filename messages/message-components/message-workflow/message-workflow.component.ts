import { Component, Input, OnInit } from '@angular/core';
/**
 * SETL Message Body Component
 *
 * Displays the Message Body
 */
@Component({
    selector: 'setl-message-workflow',
    templateUrl: './message-workflow.component.html',
    styleUrls: ['./message-workflow.component.css']
})
export class SetlMessageWorkflowComponent implements OnInit {
    @Input() data;
    @Input() userId;


    constructor () {

    }

    ngOnInit () {
        console.log(this.data);
    }

}
