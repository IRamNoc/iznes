/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {StringFilter, Comparator} from "clarity-angular";
import {Component, AfterViewInit} from "@angular/core";

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
                color: 'green'
            },
        ];
    }

    toggler() {
        this.basic = !this.basic;
    }

    onTabSelected() {

    }

    onTabIndexChanged() {

    }

    onTabContentActivated() {
    }

}
