import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { positionToGridAreaNotation } from '../helpers';

@Component({
    selector: 'app-counter-tile',
    templateUrl: 'counter-tile.component.html',
    styleUrls: ['counter-tile.component.scss']
})
export class CounterTileComponent implements OnInit {

    @HostBinding('style') style: any = '';
    @HostBinding('class') class = '';

    @Input() public position: string;
    @Input() public icon: string;
    @Input() public color: string;
    @Input() public count: number;
    @Input() public title: string;
    @Input() public route: string;

    private colors = {
        red: '#CE553D',
        blue: '#2D71B4',
        green: '#49A45F',
        orange: '#E8A02E'
    };
    public backgroundColor: string;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.style = this.sanitizer.bypassSecurityTrustStyle(this.getStyle());
        this.class = 'blocs';
        this.backgroundColor = this.colors[this.color];
    }

    getStyle(): string {
        const styles = {
            'grid-area': positionToGridAreaNotation(this.position),
            'background-color': this.colors[this.color],
            'padding-top': '10px',
            'color': 'black',
        };

        return Object.getOwnPropertyNames(styles).reduce((acc, key) => {
            return `${acc} ${key}: ${styles[key]};`;
        }, '');
    }

    public getColor() {
        return this.sanitizer.bypassSecurityTrustStyle(this.colors[this.color]);
    }
}
