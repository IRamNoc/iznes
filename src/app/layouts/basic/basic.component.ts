import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-basic-layout',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.css']
})
export class BasicLayoutComponent implements OnInit {
    private _opened: boolean = false;
    private _modeNum: number = 0;
    private _positionNum: number = 1;
    private _dock: boolean = false;
    private _closeOnClickOutside: boolean = false;
    private _closeOnClickBackdrop: boolean = true;
    private _showBackdrop: boolean = true;
    private _animate: boolean = true;
    private _trapFocus: boolean = true;
    private _autoFocus: boolean = true;
    private _keyClose: boolean = false;
    private _autoCollapseHeight: number = null;
    private _autoCollapseWidth: number = null;

    private _MODES: Array<string> = ['over', 'push', 'slide'];
    private _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];

    private _toggleSidebar() {
        this._opened = !this._opened;
        return false;
    }

    constructor() {
    }

    ngOnInit() {
    }

}
