import {Component, ContentChild, HostBinding} from '@angular/core';

@Component({
    selector : 'form-step',
    template : '<ng-content></ng-content>'
})
export class FormstepComponent{

    @ContentChild('step') step;
    @HostBinding('class') classname = 'steps-slide';
    @HostBinding('class.active') active = false;

}