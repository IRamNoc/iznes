import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MultilingualService } from '@setl/multilingual';
import { MtdashboardService } from '../service';
import * as moment from 'moment';

/* Low dash. */
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { select } from '@angular-redux/store';
import { OfiFundShareService } from '@setl/ofi-main/ofi-req-services/ofi-product/fund-share/service';
@Component({
  selector: 'app-mt10x-am',
  templateUrl: './mt10x-am.component.html',
  styleUrls: ['./mt10x-am.component.scss']
})
export class Mt10xAmComponent implements OnInit, OnDestroy {


  shareList: any[] = [];  
  filteredShareList: any[] = [];
  subscriptions: Array<Subscription> = [];
  panelDef: any = {};
  panelColumns = {};
  centralizingAgentList = [];
  shareNameList = [];
  depositoryList = [];
  clientNameList = [];
  language = 'en';
  isPeriod = true;
  selectedCentralizingAgent: number = null;
  selectedShare: number = null;
  selectedClient: number = null;
  selectedDepsoitory: number = null;
  fundItems: any;
  mtMessagesList = [];
  placeFiltersFormGroup: FormGroup;
  total: number = 0;
  lastPage: number = 0;
  readonly itemPerPage = 10;
  rowOffset = 0;
  firstInit: boolean = true;

  // Datepicker config
  fromConfigDate = {
    firstDayOfWeek: 'mo',
    format: 'YYYY-MM-DD',
    closeOnSelect: true,
    disableKeypress: true,
    locale: this.language,
    isDayDisabledCallback: (thisDate) => {
      // make sure the dateFrom that greater than dateTo can not be selected
      if (!!thisDate && this.placeFiltersFormGroup.controls['toDate'].value !== '') {
        return (thisDate.diff(this.placeFiltersFormGroup.controls['toDate'].value) > 0);
      }
      return false;
    },
  };
  toConfigDate = {
    firstDayOfWeek: 'mo',
    format: 'YYYY-MM-DD',
    closeOnSelect: true,
    disableKeypress: true,
    locale: this.language,
    isDayDisabledCallback: (thisDate) => {
      // make sure the dateTo that less than dateFrom can not be selected
      if (!!thisDate && this.placeFiltersFormGroup.controls['fromDate'].value !== '') {
        return (thisDate.diff(this.placeFiltersFormGroup.controls['fromDate'].value) < 0);
      }
      return false;
    },
  };
 /** Observables */
@select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) fundShareObs;
  constructor(
    public translate: MultilingualService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private mtDashboardService: MtdashboardService,
    private ofiFundShareService: OfiFundShareService,
    @Inject('product-config') productConfig,
  ) {   
    this.ofiFundShareService.fetchIznesAdminShareList(); 
    this.subscriptions.push(this.fundShareObs.subscribe(shares => this.shareList = shares));
    this.fundItems = productConfig.fundItems;
    this.centralizingAgentList = this.fundItems.centralizingAgentItems;
    this.shareNameList = this.fundItems.shareNameItems;
    this.depositoryList = this.fundItems.depositoryItems;
    this.clientNameList = this.fundItems.clientNameItems;
  }

  ngOnInit() {
    this.initFilterForm();
    this.initPanelColumns();
    this.initPanelDefinition();
    this.getMTDashboardList(false);
    
    this.filteredShareList = Object.keys(this.shareList).map((key) => {
      console.log(this.shareList[key].managementCompanyId,"sharee")
      // if (this.shareList[key].managementCompanyId === event.id) {
      //     return {
      //         id: key,
      //         text: this.shareList[key].fundShareName,
      //     };
      // }
  });
    console.log(this.shareList,"share list")
  }

  initPanelColumns(): void {
    this.panelColumns = {
      date: {
        label: this.translate.translate('Date'),
        dataSource: 'date',
        sortable: true,
      },
      investorName: {
        label: this.translate.translate('Investor name'),
        dataSource: 'investorName',
        sortable: true,
      },
      investorPortfolioLabel: {
        label: this.translate.translate('Investor portfolio'),
        dataSource: 'investorPortfolioLabel',
        sortable: true,
      },
      fundShareName: {
        label: this.translate.translate('Fund share'),
        dataSource: 'fundShareName',
        sortable: true,
      },
      isin: {
        label: this.translate.translate('ISIN'),
        dataSource: 'isin',
        sortable: true,
      },
      orderType: {
        label: this.translate.translate('Order type'),
        dataSource: 'typeOrder',
        sortable: true,
      },
      amount: {
        label: this.translate.translate('Amount'),
        dataSource: 'amount',
        sortable: true,
      },
      settlementDate: {
        label: this.translate.translate('Settlement date'),
        dataSource: 'settlementDate',
        sortable: true,
      },
      beneficiaryIban: {
        label: this.translate.translate('Beneficiary IBAN'),
        dataSource: 'beneficiaryIban',
        sortable: true,
      },
      messageType: {
        label: this.translate.translate('Message type'),
        dataSource: 'messageType',
        sortable: true,
      },
      messageReference: {
        label: this.translate.translate('Message reference'),
        dataSource: 'messageReference',
        sortable: true,
      },
      generationIznes: {
        label: this.translate.translate('Generation IZNES'),
        dataSource: 'generationIznes',
        sortable: true,
      },
      fundProvider: {
        label: this.translate.translate('Fund Provider'),
        dataSource: 'fundProvider',
        sortable: true,
      },
      // sendToProvider: {
      //   label: this.translate.translate('Send To Provider'),
      //   dataSource: 'sendToProvider',
      //   sortable: true,
      // },
      acknowledged: {
        label: this.translate.translate('Acknowledged'),
        dataSource: 'acknowledged',
        sortable: true,
      },
      providerTreatment: {
        label: this.translate.translate('Provider Treatment'),
        dataSource: 'providerTreatment',
        sortable: true,
      },
      comments: {
        label: this.translate.translate('Comments'),
        dataSource: 'comments',
        sortable: true,
      }

    };
  }

  initFilterForm() {
    this.placeFiltersFormGroup = this.fb.group({
      isinCode: [''],
      shareName: [''],
      depositary: [''],
      clientName: [''],
      // centralizingAgent: [0],
      fromDate: [moment().add('-3', 'year').format('YYYY-MM-DD')],
      toDate: [moment()],
    });
  }

  handleDropdownCentralizingAgentSelect(event) {
    this.selectedCentralizingAgent = this.centralizingAgentList[event.id].id;
  }
  handleDropdownshareNameSelect(event) {
    console.log(event)
    // this.selectedShare = this.shareNameList[event.id].id;
    this.selectedShare = event.id;
  }
  handleDropdownDepositorySelect(event) {
    // this.selectedClient = this.depositoryList[event.id].id;
    this.selectedClient =event.id;
  }
  handleDropdownClientnameSelect(event) {
    // this.selectedDepsoitory = this.clientNameList[event.id].id;
    this.selectedDepsoitory = event.id;
  }

  getMTDashboardList(isSearch: Boolean) {
    const request = {
      itemPerPage: this.itemPerPage,
      rowOffset: this.rowOffset,
      mtType: 'mt101',
      isinCode: this.placeFiltersFormGroup.controls['isinCode'].value,
      fundShareName: this.placeFiltersFormGroup.controls['shareName'].value,
      depositary: this.placeFiltersFormGroup.controls['depositary'].value,
      clientName: this.placeFiltersFormGroup.controls['clientName'].value,
      // centralizingAgentId: this.placeFiltersFormGroup.controls['centralizingAgent'].value.length ? this.selectedCentralizingAgent : null,
      fromDate: moment(this.placeFiltersFormGroup.controls['fromDate'].value).format('YYYY-MM-DD 00:00:00'),
      toDate: moment(this.placeFiltersFormGroup.controls['toDate'].value).format('YYYY-MM-DD 23:59:59'),
    };

    this.mtDashboardService.requestAssetManagerDashboardList(request).then((result) => {
      const data = result[1].Data;
      if (data.error) {
        //this.showAlert(this.translate.translate('Unable to view file'), 'error');
      } else {
        const items = data.map((item) => {
          return {
            date: moment(new Date(item.orderDate)).format('YYYY-MM-DD'),
            fundProvider: _.get(_.find(this.centralizingAgentList, { id: item.fundAdministratorID }), 'text', this.translate.translate('none')),
            typeOrder: item.orderType === 3 ? this.translate.translate("Subscription") : this.translate.translate("Redemption"),
            generationIznes: moment(new Date(item.dateentered)).format('HH[h]mm'),
            amount: ((item.estimatedAmount / 100000).toFixed(2)).toLocaleString(), // BLOCKCHAIN NUMBER DIVISER
            ...item
          }
        });

        if (isSearch) {
          this.mtMessagesList = items;
        } else {
          this.mtMessagesList = isSearch === true ? items : _.uniqBy([...this.mtMessagesList, ...items], 'mtid');
        }

        this.panelDef.data = this.mtMessagesList;
        this.total = _.get(data, '[0].totalResults', 0);
        this.lastPage = Math.ceil(this.total / this.itemPerPage);
        this.detectChanges(true);
        this.firstInit = false;
      };
    })
  }

  initPanelDefinition() {
    this.panelDef = {
      columns: [
        this.panelColumns['date'],
        this.panelColumns['investorName'],
        this.panelColumns['investorPortfolioLabel'],
        this.panelColumns['fundShareName'],
        this.panelColumns['isin'],
        this.panelColumns['orderType'],
        this.panelColumns['amount'],
        this.panelColumns['settlementDate'],
        this.panelColumns['beneficiaryIban'],
        this.panelColumns['messageType'],
        this.panelColumns['messageReference'],
        this.panelColumns['generationIznes'],
        this.panelColumns['fundProvider'],
        // this.panelColumns['sendToProvider'],
        this.panelColumns['acknowledged'],
        this.panelColumns['providerTreatment'],
        this.panelColumns['comments'],
      ],
      open: true,
    };
  }

  detectChanges(detect = false) {
    this.cdr.markForCheck();
    if (detect) {
      this.cdr.detectChanges();
    }
  }

  refresh(state) {
    if (!state.page || this.firstInit) {
      return;
    }

    this.rowOffset = state.page.to - 1;
    this.getMTDashboardList(false);
  }

  ngOnDestroy(): void {
    this.cdr.detach();
  }

  }
  
