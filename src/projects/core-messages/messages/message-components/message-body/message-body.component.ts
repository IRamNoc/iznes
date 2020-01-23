import { Component, Input } from '@angular/core';
/**
 * SETL Message Body Component
 *
 * Displays the Message Body
 */
@Component({
    selector: 'setl-message-body',
    templateUrl: './message-body.component.html',
    styleUrls: ['./message-body.component.css']
})
export class SetlMessageBodyComponent {
    @Input() messageBody: string = null;
}
