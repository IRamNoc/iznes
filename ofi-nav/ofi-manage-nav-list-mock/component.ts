import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';

import * as model from '../OfiManageNav';

import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';
import {OfiNavService} from '../../ofi-req-services/ofi-product/nav/service';
import {
    ofiSetCurrentManageNavRequest,
    clearRequestedManageNavList,
    getOfiManageNavListCurrentRequest
} from '../../ofi-store/ofi-product/nav';

@Component({
    selector: 'app-nav-manage-list',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiManageNavList implements OnInit, OnDestroy {

    shareListItems: any[];
    navListItems: any[];
    
    dateTypes: any[];
    searchDate: Date;
    dateConfig = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null // TODO
    };

    navPopupMode: model.NavPopupMode = model.NavPopupMode.ADD;
    addNavShare: model.NavModel = null;

    private subscriptionsArray: Subscription[] = [];

    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiManageNavList', 'requested']) navRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiManageNavList', 'navList']) navListOb: Observable<any>;

    constructor(private router: Router,
        private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private ofiCorpActionService: OfiCorpActionService,
        private ofiNavService: OfiNavService) {
        
        this.initSubscriptions();
    }
        
    ngOnInit() {
        this.initDataTypes();
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.navRequestedOb.subscribe(requested => {
            this.requestNavList(requested);
        }));
        this.subscriptionsArray.push(this.navListOb.subscribe(navList => {
            this.updateNavList(navList);
        }));
    }    

    /**
     * Request my fund access base of the requested state.
     * @param requested boolean
     * @return void
     */
    private requestUserIssuedAssets(requested: boolean): void {
        if (!requested) {
            OfiCorpActionService.defaultRequestUserIssuedAsset(this.ofiCorpActionService, this.redux);
        }
    }

    /**
     * update asset list
     * @param assetList ShareModel
     * @return void
     */
    private updateUserIssuedAssets(assetList: model.ShareModel[]): void {
        this.shareListItems = assetList;
        this.changeDetectorRef.markForCheck();
    }

    /**
     * request the nav list
     * @param requested boolean
     * @return void
     */
    private requestNavList(requested: boolean): void {
        const requestData = {
            fundName: '',
            navDate: moment().format('YY-MM-DD 00:00:00'),
            status: 0,
            pageNum: 0,
            pageSize: 1000
        }

        OfiNavService.defaultRequestNavList(this.ofiNavService, this.redux, requestData);
    }

    /**
     * update the nav list
     * @param navList NavList
     * @return void
     */
    private updateNavList(navList: model.NavModel[]): void {
        this.navListItems = navList;
        this.changeDetectorRef.markForCheck();
    }
    

    private initDataTypes(): void {
        this.dateTypes = [{
            id: 'navDate',
            text: 'NAV Date'
        }, {
            id: 'navPubDate',
            text: 'NAV Published Date'
        }];
    }
    
    addNav(share: model.NavInfoModel): void {
        this.addNavShare = share;
    }

    navigateToShare(): void {
        this.router.navigateByUrl('product-module/net-asset-value-view-mock');
    }

    ngOnDestroy() {}

}