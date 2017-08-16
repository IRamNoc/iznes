/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Component} from "@angular/core";

@Component({
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html',
})
export class HomeComponent {

    public users;

    private tabs:Array<any>;

    basic: boolean = false;

    public constructor() {

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
            },
            {
                id: '4',
                name: 'Mingrui Huang',
                creation: '1988-10-13 00:00:00',
                color: 'red'
            },
            {
                id: '5',
                name: 'Ollie Kett',
                creation: '1993-02-08 00:00:00',
                color: 'blue'
            },
            {
                id: '6',
                name: 'Mingrui Huang',
                creation: '1988-10-13 00:00:00',
                color: 'red'
            },
            {
                id: '7',
                name: 'Ollie Kett',
                creation: '1993-02-08 00:00:00',
                color: 'blue'
            },
            {
                id: '8',
                name: 'Mingrui Huang',
                creation: '1988-10-13 00:00:00',
                color: 'red'
            },
            {
                id: '9',
                name: 'Ollie Kett',
                creation: '1993-02-08 00:00:00',
                color: 'blue'
            },
            {
                id: '10',
                name: 'Mingrui Huang',
                creation: '1988-10-13 00:00:00',
                color: 'red'
            },
            {
                id: '11',
                name: 'Ollie Kett',
                creation: '1993-02-08 00:00:00',
                color: 'blue'
            },
            {
                id: '12',
                name: 'Mingrui Huang',
                creation: '1988-10-13 00:00:00',
                color: 'red'
            },
            {
                id: '13',
                name: 'Ollie Kett',
                creation: '1993-02-08 00:00:00',
                color: 'blue'
            },
            {
                id: '14',
                name: 'Mingrui Huang',
                creation: '1988-10-13 00:00:00',
                color: 'red'
            },
        ];

        this.tabs = [
            {
                "title": "tab1",
                "content": "tabcont1"
            },
            {
                "title": "tab2",
                "content": "tabcont2"
            },
            {
                "title": "tab3",
                "content": "tabcont3"
            },
            {
                "title": "tab4",
                "content": "tabcont4"
            }
        ];

        //this.total = this.users.length;
        //this.total = 10;
    }

    toggler() {
        this.basic = !this.basic;
    }

    onTabSelected () {

    }

    onTabIndexChanged () {

    }

    onTabContentActivated () {

    }

}
