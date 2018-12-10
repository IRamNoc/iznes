import {
    Component,
    ElementRef,
    Injector,
    NgZone,
    OnInit,
    ViewChild,
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ResolveEmit } from './interfaces/resolve-emit';

@Component({
    selector: 'jaspero-confirmation',
    template: `
        <div *ngIf="incomingData.overlay" class="jaspero__overlay" [@overlayAn]="animationState" (click)="overlayClick()"></div>
        <div class="jaspero__dialog" [@wrapperAn]="animationState">
            <div class="jaspero__dialog-title" [innerHtml]="incomingData.title">
            </div>

            <div class="jaspero__dialog-icon" *ngIf="incomingData.btnClass != 'success' && incomingData.btnClass != 'error'">
                <div class="f-modal-alert">
                    <div class="f-modal-icon f-modal-warning scaleWarning">
                        <span class="f-modal-body pulseWarningIns"></span>
                        <span class="f-modal-dot pulseWarningIns"></span>
                    </div>
                </div>
            </div>

            <div class="jaspero__dialog-icon" *ngIf="incomingData.btnClass == 'error'">
                <div class="f-modal-alert">
                    <div class="f-modal-icon f-modal-info-error scaleWarning">
                        <span class="f-modal-body pulseWarningInsRed"></span>
                        <span class="f-modal-dot pulseWarningInsRed"></span>
                    </div>
                </div>
            </div>

            <div class="jaspero__dialog-icon" *ngIf="incomingData.btnClass == 'success'">
                <div class="f-modal-alert">
                    <div class="f-modal-icon f-modal-success animate">
                        <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
                        <span class="f-modal-line f-modal-long animateSuccessLong"></span>
                        <div class="f-modal-placeholder"></div>
                        <div class="f-modal-fix"></div>
                    </div>
                </div>
            </div>

            <div class="jaspero__dialog-content" [innerHtml]="incomingData.message">
            </div>
            <div class="jaspero__dialog-actions">
                <button #declineBtn *ngIf="incomingData.declineText != ''" class="default" (click)="resolve({resolved: false})">{{incomingData.declineText}}</button>
                <button #confirmBtn class="{{incomingData.btnClass}}" (click)="resolve({resolved: true})">{{incomingData.confirmText}} ookk</button>
            </div>
        </div>
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
            display: -ms-flexbox;
            display: flex;
            -ms-flex-flow: column;
            flex-flow: column;
            overflow: hidden;
            position: relative;
            z-index: 2110;
            outline: none;
            border-radius: 3px;
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
            width: 50px;
            height: 50px;
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
            -ms-flex: 1;
            position: relative;
            text-align: center;
            line-height: 20px;
            font-size: 13px;
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
            border: 1px solid #afafaf;
            color: #8c8c8c !important;
            height: 36px;
            border-radius: 3px;
            line-height: 34px;
            font-size: 12px;
            padding-left: 35px;
            padding-right: 35px;
            cursor: pointer;
            margin-left: 5px;
            margin-right: 5px;
            margin-top: 12px;
            background: #ffffff;
        }

        .jaspero__dialog-actions button.default {
            color: inherit;
        }

        .jaspero__dialog-actions button.default:hover {
            background-color: hsla(0, 0%, 60%, .2);
        }

        .jaspero__dialog-actions button.primary {
            background-color: #56a4df;
            border: 1px solid #56a4df;
            color: white !important;
        }

        .jaspero__dialog-actions button.primary:hover {
            background-color: #4092d0;
            border: 1px solid #4092d0;
        }

        .jaspero__dialog-actions button.success {
            background-color: #62a420;
            border: 1px solid #62a420;
            color: white !important;
        }

        .jaspero__dialog-actions button.success:hover {
            background-color: #4b861f;
            border: 1px solid #4b861f;
        }

        .jaspero__dialog-actions button.error {
            background-color: #e62700;
            border: 1px solid #e62700;
            color: white !important;
        }

        .jaspero__dialog-actions button.error:hover {
            background-color: #b82700;
            border: 1px solid #b82700;
        }

        .jaspero__dialog-actions button.raised {
            box-shadow: 0 1px 5px rgba(0, 0, 0, .2), 0 2px 2px rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .12);
        }

        :host(.success) .jaspero__dialog-icon {
            background: #17A398
        }

        :host(.error) .jaspero__dialog-icon {
            background: #D64550
        }

        :host(.warning) .jaspero__dialog-icon {
            background: #FFC857
        }

        :host(.info) .jaspero__dialog-icon {
            background: #8FBFE0
        }
    `],
    animations: [
        trigger('overlayAn', [
            state('void', style({ opacity: 0 })),
            state('leave', style({ opacity: 0 })),
            state('enter', style({ opacity: 1 })),
            transition('void => enter', animate('400ms cubic-bezier(.25,.8,.25,1)')),
            transition('enter => leave', animate('400ms cubic-bezier(.25,.8,.25,1)'))
        ]),
        trigger('wrapperAn', [
            state('void', style({ opacity: 0, transform: 'scale(0.75, 0.75) translate(0, 0)' })),
            state('leave', style({ opacity: 0, transform: 'scale(0.75, 0.75) translate(0, 0)' })),
            state('enter', style({ opacity: 1, transform: 'scale(1, 1) translate(0, 0)' })),
            transition('void => enter', animate('450ms cubic-bezier(.5, 1.4, .5, 1)')),
            transition('enter => leave', animate('450ms cubic-bezier(.5, 1.4, .5, 1)'))
        ])
    ]
})
export class ConfirmationComponent implements OnInit {
    @ViewChild('declineBtn') declineBtn:ElementRef;
    @ViewChild('confirmBtn') confirmBtn:ElementRef;

    constructor(private _injector: Injector,
                private _ngZone: NgZone) {
        for (const key in this.incomingData) {
            const fromInjector = this._injector.get(key);

            if (fromInjector !== undefined) {
                this.incomingData[key] = fromInjector;
            }
        }

    }

    ngOnInit(): void {
        setTimeout(() => {
            this.setFocusButton();
        }, 500);
    }

    animationState = 'enter';

    incomingData: any = {
        title: '',
        message: '',
        overlay: true,
        overlayClickToClose: true,
        showCloseButton: true,
        confirmText: 'Yes',
        declineText: 'No',
        resolve: null,
        btnClass: 'primary',
        focusButton: 'decline',
    };

    overlayClick() {
        if (!this.incomingData.overlayClickToClose) {
            return;
        }

        this.close('overlayClick');
    }

    close(type: string) {
        const resolveEmit: ResolveEmit = {
            closedWithoutResolving: type
        };
        this.animationState = 'leave';
        this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this._ngZone.run(() => {
                    this.resolve(resolveEmit);
                });
            }, 450);
        });
    }

    resolve(how: ResolveEmit) {
        this.animationState = 'leave';
        this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this._ngZone.run(() => {
                    this.incomingData.resolve.next(how);
                });
            }, 450);
        });
    }

    /**
     * Set focus when confirmation pop-up first show up.
     */
    setFocusButton() {
        const buttonToFocus = this.incomingData.focusButton;

        if (buttonToFocus === 'confirm' || !this.declineBtn) {
            this.confirmBtn.nativeElement.focus();
        } else {
            this.declineBtn.nativeElement.focus();
        }

    }
}

