import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-counter-tile',
    templateUrl: 'counter-tile.component.html',
    styleUrls: ['counter-tile.component.scss'],
})
export class CounterTileComponent implements OnInit {
    @HostBinding('style.backgroundColor') backgroundColor: any = '';

    @Input() public name: string;
    @Input() public icon: string;
    @Input() public color: string;
    @Input() public count: number;
    @Input() public title: string;
    @Input() public route: string;

    private colors = {
        red: '#CE553D',
        blue: '#2D71B4',
        green: '#49A45F',
        orange: '#E8A02E',
    };

    constructor(
        private sanitizer: DomSanitizer,
    ) {
    }

    ngOnInit() {
        this.backgroundColor = this.colors[this.color];
    }
}
