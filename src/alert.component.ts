import { Component, Injector, HostBinding, Output, EventEmitter, OnInit, NgZone } from '@angular/core';
import { AlertType } from './interfaces/alert-type';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'jaspero-alert',
    template: `
        <div *ngIf="type === 'loading'; else showAlerts">
            <div *ngIf="incomingData.overlay" class="jaspero__overlay" [@overlayAnEnter]="animationState"
                 (window:keydown)="$event.preventDefault()"></div>
            <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

        <ng-template #showAlerts>
            <div *ngIf="prevType === 'loading'; else overlay">
                <div *ngIf="incomingData.overlay" class="jaspero__overlay" [@overlayAnLeave]="animationState"
                     (click)="overlayClick()"
                     (window:keydown)="keyDownFunction($event)"></div>
            </div>
            <div #overlay *ngIf="incomingData.overlay" class="jaspero__overlay" [@overlayAn]="animationState"
                 (click)="overlayClick()"
                 (window:keydown)="keyDownFunction($event)"></div>

            <div class="jaspero__dialog" [@wrapperAn]="animationState">

                <div *ngIf="incomingData.titleMessage" class="jaspero__dialog-title">
                    {{incomingData.titleMessage}}
                </div>

                <div *ngIf="!incomingData.titleMessage" class="jaspero__dialog-title">
                    {{type}}!
                </div>

                <div class="jaspero__dialog-icon" [class.fixedHeight]="type==='waiting'" [ngSwitch]="type">
                    <ng-template ngSwitchCase="success">
                        <div class="f-modal-alert">
                            <div class="f-modal-icon f-modal-success animate">
                                <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
                                <span class="f-modal-line f-modal-long animateSuccessLong"></span>
                                <div class="f-modal-placeholder"></div>
                                <div class="f-modal-fix"></div>
                            </div>
                        </div>
                    </ng-template>

                    <ng-template ngSwitchCase="error">
                        <div class="f-modal-alert">
                            <div class="f-modal-icon f-modal-error animate">
                            <span class="f-modal-x-mark">
                                <span class="f-modal-line f-modal-left animateXLeft"></span>
                                <span class="f-modal-line f-modal-right animateXRight"></span>
                            </span>
                                <div class="f-modal-placeholder"></div>
                                <div class="f-modal-fix"></div>
                            </div>
                        </div>
                    </ng-template>

                    <ng-template ngSwitchCase="warning">
                        <div class="f-modal-alert">
                            <div class="f-modal-icon f-modal-warning scaleWarning">
                                <span class="f-modal-body pulseWarningIns"></span>
                                <span class="f-modal-dot pulseWarningIns"></span>
                            </div>
                        </div>
                    </ng-template>

                    <ng-template ngSwitchCase="info">
                        <div class="f-modal-alert">
                            <div class="f-modal-icon f-modal-info scaleWarning">
                                <span class="f-modal-body pulseWarningInsBlue"></span>
                                <span class="f-modal-dot pulseWarningInsBlue"></span>
                            </div>
                        </div>
                    </ng-template>

                    <ng-template ngSwitchCase="waiting">
                        <div class="loader"></div>
                    </ng-template>
                </div>

                <div class="jaspero__dialog-content" [innerHTML]="incomingData.message">
                </div>
                <div class="jaspero__dialog-actions">
                    <button type="button" class="default" *ngIf="incomingData.showCloseButton" (click)="closeSelf()">
                        {{incomingData.buttonMessage}}
                    </button>
                </div>
            </div>
        </ng-template>
    `,
    styles: [`
        :host {
            display: block;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-flow: column;
            flex-flow: column;
            -ms-flex-pack: center;
            justify-content: center;
            -ms-flex-align: center;
            align-items: center;
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 2108;
            pointer-events: auto;
        }

        .jaspero__overlay {
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: rgba(141, 150, 165, 0.71);
            transform: translateZ(0);
            opacity: 0;
            transition: all .5s cubic-bezier(.35, 0, .25, 1);
            position: fixed;
            z-index: 2109;
        }

        .jaspero__dialog {
            min-width: 300px;
            max-width: 500px;
            max-height: 100%;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-flow: column;
            flex-flow: column;
            overflow: hidden;
            position: relative;
            z-index: 2110;
            outline: none;
            border-radius: 4px;
            opacity: 0;
            -ms-transform: scale(.9, .85);
            transform: scale(.9, .85);
            -ms-transform-origin: center center;
            transform-origin: center center;
            transition: opacity .4s cubic-bezier(.25, .8, .25, 1), transform .4s cubic-bezier(.25, .8, .25, 1) .05s;
            will-change: opacity, transform;
            background-color: #fff;
            color: rgba(0, 0, 0, .87);
        }

        .jaspero__dialog-icon {
            padding: 20px 10px 0;
            text-align: center;
        }

        .jaspero__dialog-icon svg {
            width: 40px;
            height: 40px;
        }

        .jaspero__dialog-icon svg path {
            fill: white;
        }

        .jaspero__dialog-title {
            font-size: 24px;
            letter-spacing: .005em;
            line-height: 26px;
            padding: 20px 20px 0;
            text-transform: capitalize;
            text-align: center;
            font-weight: 500;
            border-bottom: 1px solid #d5d6d6;
            background: #f7f7f7;
            padding: 20px;
            color: #383d48;
            font-weight: bold;
            margin-top: 0;
            font-size: 22px;
        }

        .jaspero__dialog-content {
            padding: 0 20px 30px;
            position: relative;
            text-align: center;
            line-height: 20px;
        }

        .jaspero__dialog-actions {
            border-top: 1px solid #d5d6d6;
            background: #f8fafb;
            min-height: 60px;
            padding: 0;
            -ms-flex-align: center;
            align-items: center;
            -ms-flex-pack: end;
            justify-content: flex-end;
            position: relative;
            text-align: center;
        }

        .jaspero__dialog-actions button {
            margin-top: 11px;
            border: 1px solid #afafaf;
            color: #8c8c8c !important;
            height: 36px;
            border-radius: 3px;
            line-height: 34px;
            font-size: 12px;
            padding-left: 35px;
            padding-right: 35px;
            cursor: pointer;
            background: #ffffff;
        }

        .jaspero__dialog-actions button.default {
            color: inherit;
        }

        .jaspero__dialog-actions button.default:hover {
            background-color: rgba(141, 150, 165, 0.1);
        }

        .jaspero__dialog-actions button.primary {
            background-color: #ec4a1d;
            color: white;
        }

        .jaspero__dialog-actions button.primary:hover {
            background-color: #1e88e5;
        }

        .jaspero__dialog-actions button.raised {
            box-shadow: 0 1px 5px rgba(0, 0, 0, .2), 0 2px 2px rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .12);
        }

        .fixedHeight {
            height: 90px;
        }

        :host(.success) .jaspero__dialog-icon svg path {
            /*fill: #17A398;*/
            fill: #a5dc86;
        }

        :host(.error) .jaspero__dialog-icon svg path {
            fill: #D64550
        }

        :host(.warning) .jaspero__dialog-icon svg path {
            fill: #FFC857
        }

        :host(.info) .jaspero__dialog-icon svg path, :host(.info) .jaspero__dialog-icon svg circle {
            fill: #8FBFE0
        }

        .loading-dots span {
            border-radius: 100%;
            background: #ffffff;
            width: 25px;
            height: 25px;
            content: '';
            animation-name: blink;
            animation-duration: 1.4s;
            animation-iteration-count: infinite;
            animation-fill-mode: both;
            z-index: 2110;
            position: fixed;
            top: 50%;
            margin-top: -12.5px;
            margin-left: -35px;
        }

        .loading-dots span:nth-child(2) {
            animation-delay: .2s;
            margin-left: 0;
        }

        .loading-dots span:nth-child(3) {
            animation-delay: .4s;
            margin-left: 35px;
        }

        @keyframes blink {
            0% {
                opacity: .2;
            }
            20% {
                opacity: 1;
            }
            100% {
                opacity: .2;
            }
        }
    `],
    animations: [
        trigger('overlayAn', [
            state('void', style({ opacity: 0 })),
            state('leave', style({ opacity: 0 })),
            state('enter', style({ opacity: 1 })),
            transition('void => enter', animate('400ms cubic-bezier(.25,.8,.25,1)')),
            transition('enter => leave', animate('400ms cubic-bezier(.25,.8,.25,1)')),
        ]),
        trigger('overlayAnEnter', [
            state('void', style({ opacity: 0 })),
            state('leave', style({ opacity: 0 })),
            state('enter', style({ opacity: 1 })),
            transition('void => enter', animate('400ms cubic-bezier(.25,.8,.25,1)')),
        ]),
        trigger('overlayAnLeave', [
            state('void', style({ opacity: 0 })),
            state('leave', style({ opacity: 0 })),
            state('enter', style({ opacity: 1 })),
            transition('enter => leave', animate('400ms cubic-bezier(.25,.8,.25,1)')),
        ]),
        trigger('wrapperAn', [
            state('void', style({ opacity: 0, transform: 'scale(0.75, 0.75) translate(0, 0)' })),
            state('leave', style({ opacity: 0, transform: 'scale(0.75, 0.75) translate(0, 0)' })),
            state('enter', style({ opacity: 1, transform: 'scale(1, 1) translate(0, 0)' })),
            transition('void => enter', animate('450ms cubic-bezier(.5, 1.4, .5, 1)')),
            transition('enter => leave', animate('450ms cubic-bezier(.5, 1.4, .5, 1)')),
        ]),
    ],
})
export class AlertComponent implements OnInit {

    constructor(private injector: Injector,
                private ngZone: NgZone) {
    }

    animationState = 'enter';

    @Output() close: EventEmitter<any> = new EventEmitter();
    @HostBinding('class') type: AlertType;
    @HostBinding('class') prevType: string;

    incomingData: any = {
        titleMessage: false,
        message: '',
        overlay: true,
        overlayClickToClose: true,
        showCloseButton: true,
        duration: 0,
        buttonMessage: 'Close',
    };

    ngOnInit() {
        this.type = this.injector.get('type');
        this.prevType = this.injector.get('prevType');
        for (const key in this.incomingData) this.incomingData[key] = this.injector.get(key);

        if (this.incomingData.duration) {
            this.ngZone.runOutsideAngular(() =>
                setTimeout(
                    () =>
                        this.ngZone.run(() =>
                            this.closeSelf(),
                        ),
                    this.incomingData.duration,
                ),
            );
        }
    }

    closeSelf() {
        this.animationState = 'leave';
        this.close.emit(Object.assign({ close: true }, this.incomingData));
    }

    overlayClick() {
        if (!this.incomingData.overlayClickToClose) return;
        this.closeSelf();
    }

    keyDownFunction(event) {
        if (!this.incomingData.overlayClickToClose) return;
        if (event.keyCode === 13 || event.keyCode === 27) {
            event.preventDefault();
            this.closeSelf();
        }
    }

    updateMessage(message) {
        this.incomingData.message = message;
    }

    updateAlertType(type) {
        this.type = type;
    }
}
