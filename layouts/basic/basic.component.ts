import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-basic-layout',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.css']
})
export class BasicLayoutComponent implements OnInit {
    public _opened: boolean = false;
    public _modeNum: number = 0;
    public _positionNum: number = 1;
    public _dock: boolean = false;
    public _closeOnClickOutside: boolean = false;
    public _closeOnClickBackdrop: boolean = true;
    public _showBackdrop: boolean = true;
    public _animate: boolean = true;
    public _trapFocus: boolean = true;
    public _autoFocus: boolean = true;
    public _keyClose: boolean = false;
    public _autoCollapseHeight: number = null;
    public _autoCollapseWidth: number = null;

    public _MODES: Array<string> = ['over', 'push', 'slide'];
    public _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];

    public _toggleSidebar() {
        this._opened = !this._opened;
        return false;
    }

    constructor() {
    }

    ngOnInit() {
    }

}
