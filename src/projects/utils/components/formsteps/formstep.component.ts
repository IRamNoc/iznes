import { Component, ContentChild, TemplateRef } from '@angular/core';

@Component({
    selector : 'form-step',
    template : '<ng-content></ng-content>',
})
export class FormstepComponent {
    /** Reference to the KYC Step template - gets rendered by FormstepsComponent */
    @ContentChild('stepTemplate') template: TemplateRef<any>;
    /** Access to the KYC step component - methods get called by FormstepsComponent */
    @ContentChild('step') step;
}
