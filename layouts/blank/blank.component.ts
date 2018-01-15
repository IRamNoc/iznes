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
    }

    public getRouterOutletState(outlet) {
        if (!outlet || !outlet.activatedRoute) {
            return;
        }
        return outlet.activatedRoute.snapshot._routerState.url || null;
    }
}
