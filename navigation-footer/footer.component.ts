import { Component } from '@angular/core';
import { MultilingualService } from '@setl/multilingual/multilingual.service';

@Component({
    selector: 'navigation-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class NavigationFooterComponent {
    public year: number = new Date().getFullYear();

    constructor(public translate: MultilingualService) {
    }
}
