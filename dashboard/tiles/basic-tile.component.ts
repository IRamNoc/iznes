import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-basic-tile',
    templateUrl: 'basic-tile.component.html',
    styleUrls: ['counter-tile.component.scss', 'basic-tile.component.scss'],
})
export class BasicTileComponent implements OnInit {

    @HostBinding('style.backgroundColor') backgroundColor: any = '';
    @HostBinding('style.gridArea') gridArea: any = '';
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
        this.backgroundColor = this.sanitizer.bypassSecurityTrustStyle(this.colors[this.color]);
        this.gridArea = this.sanitizer.bypassSecurityTrustStyle(this.name);
        this.class = 'blocs';
    }
}
