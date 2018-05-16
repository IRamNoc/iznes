import {Component, OnInit} from '@angular/core';
import {Subpanel} from './models';
import {MockFundService} from './fund.mock.service';
import {LogService} from '@setl/utils';

@Component({
    selector: 'app-ui-layouts-layout2',
    templateUrl: './layout2.component.html',
    styles: [`
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

        }`
    ]
})
export class UiLayout2Component {

    public showInfoPanes: boolean = true;

    public panelDefs: Subpanel[];

    constructor(private service: MockFundService, private logService: LogService) {
    }

    toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

    ngOnInit() {
        this.panelDefs = [
            {
                title: 'Shares',
                columns: [
                    {
                        label: 'Share name',
                        dataSource: 'name',
                        sortable: true,
                        link: '/product-module/shares/:id',
                    },
                    {
                        label: 'Fund name',
                        dataSource: 'fund',
                        sortable: true,
                    },
                    {
                        label: 'ISIN',
                        dataSource: 'isin',
                        sortable: true,
                    },
                    {
                        label: 'Management company',
                        dataSource: 'managementCompany',
                        sortable: true,
                    },
                    {
                        label: 'Type of share',
                        dataSource: 'type',
                        sortable: true,
                    },
                    {
                        label: 'Status (close or open?)',
                        dataSource: 'status',
                        sortable: true,
                    },
                ],
                action: {
                    title: 'Add new Share',
                    icon: 'plus',
                    callback: this.addShare,
                },
                open: false,
                data: this.service.getShares(),
            },
            {
                title: 'Funds',
                columns: [
                    {
                        label: 'Fund name',
                        dataSource: 'name',
                        sortable: true,
                        //link: '/product-module/funds/:id',
                    },
                    {
                        label: 'LEI',
                        dataSource: 'lei',
                        sortable: true,
                    },
                    {
                        label: 'Management company',
                        dataSource: 'managementCompany',
                        sortable: true,
                    },
                    {
                        label: 'Country',
                        dataSource: 'country',
                        sortable: true,
                    },
                    {
                        label: 'Low status',
                        dataSource: 'lowStatus',
                        sortable: true,
                    },
                    {
                        label: 'Umbrella fund (to which the fund belongs)',
                        dataSource: 'umbrellaFund',
                        sortable: true,
                    },
                    {
                        label: 'Currency of the fund',
                        dataSource: 'currency',
                        sortable: true,
                    },
                ],
                action: {
                    title: 'Add new Fund',
                    icon: 'plus',
                    callback: this.addFund,
                },
                open: false,
                data: this.service.getFunds(),
            },
            {
                title: 'Umbrella Funds',
                columns: [
                    {
                        label: 'Umbrella fund name',
                        dataSource: 'name',
                        sortable: true,
                        //link: '/product-module/umbrella-funds/:id',
                    },
                    {
                        label: 'LEI',
                        dataSource: 'lei',
                        sortable: true,
                    },
                    {
                        label: 'Management company',
                        dataSource: 'managementCompany',
                        sortable: true,
                    },
                    {
                        label: 'Country',
                        dataSource: 'country',
                        sortable: true,
                    },
                    {
                        label: 'Currency of the umbrealla fund',
                        dataSource: 'currency',
                        sortable: true,
                    },
                ],
                action: {
                    title: 'Add new Fund',
                    icon: 'plus',
                    callback: this.addUmbreallaFund,
                },
                open: false,
                data: this.service.getUmbrellaFunds(),
            },
        ];
    }

    buildLink(column, row) {
        let ret = column.link;
        column.link.match(/:\w+/g).forEach((match) => {
            const key = match.substring(1);
            const regex = new RegExp(match);
            ret = ret.replace(regex, row[key]);
        });
        return ret;
    }

    addShare() {
        this.logService.log('add new share!');
    }

    addFund() {
        this.logService.log('add new fund!');
    }

    addUmbreallaFund() {
        this.logService.log('add umbrealla fund!');
    }

}
