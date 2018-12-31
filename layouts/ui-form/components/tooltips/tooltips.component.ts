import { Component, Inject, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';

import { Subject, Subscription } from 'rxjs';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-ui-layouts-tooltips',
    templateUrl: './tooltips.component.html',
    styles: [`
        .slider {
            left: 0;
        }

        .slider.round {
            min-height: 24px;
            margin-top: -6px;
        }

        .padding {
            padding: 0 20px 20px;
        }

        .toggle-info-panes {
            display: block;
            padding-bottom: 10px;
            text-decoration: none;

        &
        :before,

        &
        :after {
            text-decoration: none;
        }

        }
        .infoBulle {
            display: block;
            border-radius: 100px;
            background-color: #3c739c;
            font-size: 2em;
            color: white;
            font-weight: bold;
            font-family: sans-serif;
            text-align: center;
        }

        .infoBulle:after {
            content: '?';
        }

        .randomTooltips {
            background-color: rgba(255, 200, 0, .4);
        }

        .ib-small {
            width: 50px;
            height: 50px;
            line-height: 50px;
        }

        .ib-medium {
            width: 80px;
            height: 80px;
            line-height: 80px;
            font-size: 3em;
        }

        .ib-large {
            width: 120px;
            height: 120px;
            line-height: 120px;
            font-size: 4em;
        }

        .explain {
            display: inline-block;
            background: rgba(200, 200, 0, 0.8);
            padding: 0px 8px 2px 8px;
            margin: -10px 0;
            font-weight: 900;
            color: #286F8A;
            border-radius: 4px;
        }

        .topLeft {
            position: absolute;
            top: 0;
            left: 0;
            width: 100px;
            height: 100px;
            line-height: 100px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 100px;
            text-align: center;
            color: white;
            font-size: 3em;
            font-weight: bold;
            font-family: sans-serif;
        }

        .topRight {
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 100px;
            line-height: 100px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 100px;
            text-align: center;
            color: white;
            font-size: 3em;
            font-weight: bold;
            font-family: sans-serif;
        }

        .middleLeft {
            position: absolute;
            top: 50%;
            margin-top: -50px;
            left: 0;
            width: 100px;
            height: 100px;
            line-height: 100px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 100px;
            text-align: center;
            color: white;
            font-size: 3em;
            font-weight: bold;
            font-family: sans-serif;
        }

        .middleTop {
            position: absolute;
            top: 0;
            left: 50%;
            margin-left: 50px;
            width: 100px;
            height: 100px;
            line-height: 100px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 100px;
            text-align: center;
            color: white;
            font-size: 3em;
            font-weight: bold;
            font-family: sans-serif;
        }

        .middleBottom {
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: 50px;
            width: 100px;
            height: 100px;
            line-height: 100px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 100px;
            text-align: center;
            color: white;
            font-size: 3em;
            font-weight: bold;
            font-family: sans-serif;
        }

        .middleRight {
            position: absolute;
            top: 50%;
            margin-top: -50px;
            right: 0;
            width: 100px;
            height: 100px;
            line-height: 100px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 100px;
            text-align: center;
            color: white;
            font-size: 3em;
            font-weight: bold;
            font-family: sans-serif;
        }

        .bottomLeft {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100px;
            height: 100px;
            line-height: 100px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 100px;
            text-align: center;
            color: white;
            font-size: 3em;
            font-weight: bold;
            font-family: sans-serif;
        }

        .bottomRight {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 100px;
            height: 100px;
            line-height: 100px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 100px;
            text-align: center;
            color: white;
            font-size: 3em;
            font-weight: bold;
            font-family: sans-serif;
        }
    `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiTooltipsComponent implements OnInit {

    showInfoPanes: boolean = true;

    lang: string;
    Arr = Array;
    nbMaxRandomTooltips = 100;
    allPosXYRandomTolltips = [];
    allSize = ['small', 'medium', 'large'];
    showRandomTooltips = false;
    showRandomTooltipsOpened = false;

    connectedWalletId = 0;

    showTour = false;
    tourObject = [];
    userTourEnums: any;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    @select(['user', 'siteSettings', 'language']) language$;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;

    private unsubscribe: Subject<any> = new Subject();

    constructor(
        private fb: FormBuilder,
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        public _translate: MultilingualService,
    ) {

        this.language$.takeUntil(this.unsubscribe).subscribe((language) => this.lang = language);

        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
        }));
    }

    ngOnInit() {
        //this.launchTour();
    }

    randomString(len) {
        const charSet = ' ABC DEFGHIJ KLMNOP QRSTUV WXYZ abcde fghijkl mnopq rstuvw xyz 0123 45678 9 ';
        let randomString = '';
        for (let i = 0; i < len; i++) {
            const randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    }

    getRandomIntRange(type) {
        const pageSize = this.getPageSize();
        const min = 50;
        let max = 0;
        if (type === 'top') {
            max = pageSize.height - (50 * 4);
        } else if (type === 'left') {
            max = pageSize.width - (50 * 1);
        } else {
            return 0;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getPageSize() {
        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;
        return { width: x, height: y };
    }

    generateRandomTooltips(opened?): void {
        this.allPosXYRandomTolltips = []; // reset
        if (this.showRandomTooltips && this.showRandomTooltipsOpened && opened) {
            this.showRandomTooltips = false;
        }
        if (this.showRandomTooltips && this.showRandomTooltipsOpened && !opened) {
            this.showRandomTooltipsOpened = false;
        }
        if (this.showRandomTooltips || this.showRandomTooltipsOpened) {
            this.nbMaxRandomTooltips = (opened) ? Math.ceil(this.nbMaxRandomTooltips / 10) : this.nbMaxRandomTooltips;
            for (let i = 0; i < this.nbMaxRandomTooltips; i++) {
                this.allPosXYRandomTolltips.push({
                    x: this.getRandomIntRange('left') + 'px',
                    y: this.getRandomIntRange('top') + 'px',
                    size: this.allSize[Math.floor(Math.random() * this.allSize.length)],
                    text: this.randomString(Math.round(Math.random() * 500)),
                    title: (Math.round(Math.random()) === 0) ? '' : this.randomString(Math.round(Math.random() * 100)),
                    autoshow: (opened) ? true : false,
                });
            }
        } else {
            // remove all
            for (let i = 0; i < this.allPosXYRandomTolltips.length; i++) {
                if (document.getElementById('randomTooltip_' + i)) document.getElementById('randomTooltip_' + i).remove();
            }
            this.nbMaxRandomTooltips = 100;
        }
        this.changeDetectorRef.markForCheck();
    }

/*    resetUserTour() {
        if (this.connectedWalletId > 0) {
            setTimeout(() => {
                const asyncTaskPipe = this._userTourService.saveUserTour({
                    type: this.userTourEnums.names.utdemousertour,
                    value: 0,
                    walletid: this.connectedWalletId,
                });

                this.ngRedux.dispatch({
                    type: 'RUN_ASYNC_TASK',
                    successTypes: (data) => {
                    },
                    failureTypes: (data) => {
                    },
                    descriptor: asyncTaskPipe,
                    args: {},
                    successCallback: (response) => {
                        UserTourService.setRequestedUserTours(false, this.ngRedux);
                    },
                    failureCallback: (response) => {
                        console.log('UserTour save error: ', response);
                    },
                });
            }, 200);
        }
    }*/

 /*   launchTour() {
        this.tourObject = [];
        setTimeout(() => {
            this.tourObject.push(
                {
                    usertourName: this.userTourEnums.names.utdemousertour,
                    title: this._translate.translate('Auto-scroll to element'),
                    text: this._translate.translate('Duration forced to 3s (default 5s).'),
                    target: 'tooltip-label-directives',
                    duration: 3000,
                },
                {
                    title: this._translate.translate('Translations reports'),
                    text: this._translate.translate('Get a report of all missing translations.'),
                    target: 'translation-report-button',
                },
                {
                    title: this._translate.translate('Tooltip Tour'),
                    text: this._translate.translate('This is here the tooltip tour started.'),
                    target: 'tooltip-tour-btn',
                },
                {
                    title: this._translate.translate('User Infos'),
                    text: this._translate.translate('Here you can see you last connection.'),
                    target: 'topBarMenu',
                },
                {
                    title: this._translate.translate('My Reports'),
                    text: this._translate.translate('Here you can see your reports.'),
                    target: 'menu-am-report-section',
                    redirect: '/home',
                },
            );
            this.showTour = true;
            this.changeDetectorRef.markForCheck();
        }, 50);
    }*/

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

}
