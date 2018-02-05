import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-basic-tile',
    templateUrl: 'basic-tile.component.html',
    styleUrls: ['counter-tile.component.scss', 'basic-tile.component.scss'],
})
export class BasicTileComponent implements OnInit {

    @HostBinding('style') style: any = '';
    @HostBinding('class') class = '';

    @Input() public color: string;
    @Input() public name: string;

    private colors = {
        red: '#CE553D',
        blue: '#2D71B4',
        green: '#49A45F',
        orange: '#E8A02E',
    };

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.style = this.sanitizer.bypassSecurityTrustStyle(this.getStyle());
        this.class = 'blocs';
    }

    getStyle(): string {
        const styles = {
            'grid-area': this.name,
            'background-color': this.colors[this.color],
        };

        return Object.keys(styles).reduce(
            (acc, key) => `${acc} ${key}: ${styles[key]};`,
            '',
        );
    }
}
