import { Component, OnInit } from '@angular/core';
import { FadeSlideTop } from '../../animations/fade-slide-top';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-blank',
    templateUrl: './blank.component.html',
    styleUrls: ['./blank.component.scss'],
    animations: [FadeSlideTop],
})
export class BlankLayoutComponent implements OnInit {

    constructor(
        public translate: MultilingualService,
    ) {
    }

    ngOnInit() {
        const leaveMessage = this.translate.translate(
            'Changes that you made may not be saved if you leave this page.');

        window.onbeforeunload = function (e) {
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
