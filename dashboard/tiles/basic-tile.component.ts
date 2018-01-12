import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { positionToGridAreaNotation } from '../helpers';

@Component({
    selector: 'app-basic-tile',
    templateUrl: 'basic-tile.component.html',
    styleUrls: ['basic-tile.component.scss']
})
export class BasicTileComponent implements OnInit {

    @HostBinding('style') style: any = '';
    @HostBinding('class') class = '';

    @Input() public position: string;
    @Input() public color: string;

    private colors = {
        red: '#CE553D',
        blue: '#2D71B4',
        green: '#49A45F',
        orange: '#E8A02E'
    };

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.style = this.sanitizer.bypassSecurityTrustStyle(this.getStyle());
        this.class = 'blocs';
    }

    getStyle(): string {
        const styles = {
            'grid-area': positionToGridAreaNotation(this.position),
            'border-top': `10px solid ${this.colors[this.color]}`,
            'background-color': this.colors[this.color],
            'color': 'black',
        };

        return Object.getOwnPropertyNames(styles).reduce((acc, key) => {
            return `${acc} ${key}: ${styles[key]};`;
        }, '');
    }
}
