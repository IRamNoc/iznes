/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {StringFilter, Comparator} from 'clarity-angular';
import {Component, AfterViewInit} from '@angular/core';

import {fromJS} from 'immutable';

import {FileDropComponent} from '@setl/core-filedrop';

import {FormGroup, FormControl} from '@angular/forms';

import {MultilingualService} from '@setl/multilingual';

import {FileService} from '@setl/core-req-services';
import {SagaHelper} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';
import {AlertsService, AlertType} from '@setl/jaspero-ng2-alerts';
import _ from 'lodash';

interface User {
    id: number;
    name: string;
    creation: Date;
    color: string;

    // Type for dynamic access to specific properties
    [key: string]: any;
}

class MyFilter implements StringFilter<User> {
    accepts(user: User, search: string): boolean {
        return '' + user.number === search
            || user.name.toLowerCase().indexOf(search) >= 0;
    }
}

class ColorFilter implements StringFilter<User> {
    accepts(user: User, search: string): boolean {
        return '' + user.number === search
            || user.color.toLowerCase().indexOf(search) >= 0;
    }
}

@Component({
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html',
})


export class HomeComponent {

    public myFilter = new MyFilter();
    public colorFilter = new ColorFilter();

    public users;

    public tabs: Array<any>;

    basic = false;

    /*
     * File Drop Example.
     * -----------------
     * Formgroup has formcontrols bound to both file drop zones.
     *
     * onDropFiles captures the event put out too.
     */

    public filesFormGroup: FormGroup;

    /**
     * On Drop Files subscriber
     *
     * @param event
     *
     * @return {void}
     */
    public onDropFiles ( event ) {
        /* Event contains the latest changes. */
        console.log('file drop event emitted: ', event);

        const asyncTaskPipe = this.fileService.addFile({
            files: _.filter(event.files, function (file) {
               return file.status !== 'uploaded-file';
            })
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (function (data) {
                console.log('Add File success: ');
                console.log(data); // success
                if (data[1] && data[1].Data) {
                    let errorMessage = '';
                    _.each(data[1].Data, function (file) {
                        if (file.error) {
                            errorMessage += file.error + '<br/>';
                            event.target.updateFileStatus(file.id, 'file-error');
                        } else {
                            event.target.updateFileStatus(file[0].id, 'uploaded-file');
                        }
                    });
                    if (errorMessage) {
                        this.showAlert(errorMessage, 'error');
                    }
                }
            }).bind(this),
            function (data) {
                console.log('Add File error: ');
                console.log(data); // error
            })
        );
    }

    /**
     * Show Alert
     *
     * @param {string} message
     * @param {string} level
     *
     * @return {void}
     */
    public showAlert(message, level = 'error') {
        this.alertsService.create(level as AlertType, `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-${level}">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    public constructor(
        private multilingualService: MultilingualService,
        private ngRedux: NgRedux<any>,
        private fileService: FileService,
        private alertsService: AlertsService
    ) {

        /* Init the files form group. */
        this.filesFormGroup = new FormGroup({
            'singleFile': new FormControl([]),
            'multipleFiles': new FormControl([])
        });

        this.users = [
            {
                id: '1',
                name: 'Ollie Kett',
                creation: '1993-02-08 00:00:00',
                color: 'blue'
            },
            {
                id: '2',
                name: 'Mingrui Huang',
                creation: '1988-10-13 00:00:00',
                color: 'red'
            },
            {
                id: '3',
                name: 'Ollie Kett',
                creation: '1993-02-08 00:00:00',
                color: 'blue'
            }
        ];

        console.log( this.multilingualService.getTranslation('txt_home') );
    }

    toggler () {
        this.basic = !this.basic;
    }

    ngAfterViewInit() {

        // this.tabs = [
        //     {
        //         "title": "tab1",
        //         "content": "tabcont1"
        //     },
        //     {
        //         "title": "tab2",
        //         "content": "tabcont2"
        //     },
        //     {
        //         "title": "tab3",
        //         "content": "tabcont3"
        //     },
        //     {
        //         "title": "tab4",
        //         "content": "tabcont4"
        //     }
        // ];
    }

    onTabSelected() {

    }

    onTabIndexChanged() {

    }

    onTabContentActivated() {
    }

}
