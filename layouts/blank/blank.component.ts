import { Component, OnInit } from '@angular/core';
import { FadeSlideTop } from '../../animations/fade-slide-top';

@Component({
    selector: 'app-blank',
    templateUrl: './blank.component.html',
    styleUrls: ['./blank.component.css'],
    animations: [FadeSlideTop]
})
export class BlankLayoutComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        window.onbeforeunload = function (e) {
            const leaveMessage = 'Changes that you made may not be saved if you leave this page.';
            e.returnValue = leaveMessage;
            return leaveMessage;
        };
    }

    public getRouterOutletState(outlet) {
        if (!outlet || !outlet.activatedRoute) {
            return;
        }
        return outlet.activatedRoute.snapshot._routerState.url || null;
    }
}
