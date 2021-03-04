import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MultilingualService } from '@setl/multilingual';
import { MtdashboardService } from '../service';
import * as moment from 'moment';

/* Low dash. */
import * as _ from 'lodash';
@Component({
  selector: 'app-mt10x-am',
  templateUrl: './mt10x-am.component.html',
  styleUrls: ['./mt10x-am.component.scss']
})
export class Mt10xAmComponent implements OnInit, OnDestroy {


  panelDef: any = {};
  panelColumns = {};
  centralizingAgentList = [];
  language = 'en';
  isPeriod = true;
  selectedCentralizingAgent: number = null;
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

  constructor(
    public translate: MultilingualService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private mtDashboardService: MtdashboardService,
    @Inject('product-config') productConfig,
  ) {
    this.fundItems = productConfig.fundItems;
    this.centralizingAgentList = this.fundItems.centralizingAgentItems;
  }

  ngOnInit() {
    this.initFilterForm();
    this.initPanelColumns();
    this.initPanelDefinition();
    this.getMTDashboardList();
  }

  initPanelColumns(): void {
    this.panelColumns = {
      date: {
        label: this.translate.translate('Date'),
        dataSource: 'date',
        sortable: true,
      },
      investorName: {
        label: this.translate.translate('Name Of Client'),
        dataSource: 'investorName',
        sortable: true,
      },
      investorPortfolioLabel: {
        label: this.translate.translate('Client Portfolio Label'),
        dataSource: 'investorPortfolioLabel',
        sortable: true,
      },
      fundShareName: {
        label: this.translate.translate('Fund Share'),
        dataSource: 'fundShareName',
        sortable: true,
      },
      isin: {
        label: this.translate.translate('ISIN Code'),
        dataSource: 'isin',
        sortable: true,
      },
      orderType: {
        label: this.translate.translate('Order Type'),
        dataSource: 'typeOrder',
        sortable: true,
      },
      estimatedAmount: {
        label: this.translate.translate('Amount'),
        dataSource: 'estimatedAmount',
        sortable: true,
      },
      settlementDate: {
        label: this.translate.translate('Settlement Date'),
        dataSource: 'settlementDate',
        sortable: true,
      },
      beneficiaryIban: {
        label: this.translate.translate('IBAN Of Beneficiary'),
        dataSource: 'beneficiaryIban',
        sortable: true,
      },
      messageType: {
        label: this.translate.translate('Message Type'),
        dataSource: 'messageType',
        sortable: true,
      },
      messageReference: {
        label: this.translate.translate('Message Reference'),
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
      sendToProvider: {
        label: this.translate.translate('Send To Provider'),
        dataSource: 'sendToProvider',
        sortable: true,
      },
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
      fromDate: [''],
      toDate: [''],
    });
  }

  handleDropdownCentralizingAgentSelect(event) {
    this.selectedCentralizingAgent = this.centralizingAgentList[event.id].id;
  }

  getMTDashboardList() {
    const request = {
      itemPerPage: this.itemPerPage,
      rowOffset: this.rowOffset,
      mtType: 'mt101',
      isinCode: this.placeFiltersFormGroup.controls['isinCode'].value,
      fundShareName: this.placeFiltersFormGroup.controls['shareName'].value,
      depositary: this.placeFiltersFormGroup.controls['depositary'].value,
      clientName: this.placeFiltersFormGroup.controls['clientName'].value,
      // centralizingAgentId: this.placeFiltersFormGroup.controls['centralizingAgent'].value.length ? this.selectedCentralizingAgent : null,
      fromDate: this.placeFiltersFormGroup.controls['fromDate'].value,
      toDate: this.placeFiltersFormGroup.controls['toDate'].value,
    };

    this.mtDashboardService.requestAssetManagerDashboardList(request).then((result) => {
      const data = result[1].Data;
      if (data.error) {
        //this.showAlert(this.translate.translate('Unable to view file'), 'error');
      } else {
        const items = data.map((item) => {
          console.log(item,"itemssss")
          return {
            date: moment(new Date(item.orderDate)).format('YYYY-MM-DD'),
            // centralizingAgent: this.centralizingAgentList[item.centralizingAgentId].text || this.translate.translate('none'),
            typeOrder: item.orderType === 3 ? this.translate.translate("Subscription") : this.translate.translate("Redemption"),
            messageType: `MT101 (${item.byAmountOrQuantity === 1 ? this.translate.translate("Quantity") : this.translate.translate("Amount")})`,
            // cutoffDate: moment(new Date(item.cutoff)).format('HH[h]mm'),
            generationIznes: moment(new Date(item.dateentered)).format('HH[h]mm'),
            // sendToCentralizer: _.get(item, 'sendToCentralizingAgent') ? moment(new Date(item.sendToCentralizingAgent)).format('HH[h]mm') : this.translate.translate("Unknown"),
            // quantity: item.estimatedQuantity / 100000, // BLOCKCHAIN NUMBER DIVISER
            ...item
          }
        });

        this.mtMessagesList = _.uniqBy([...this.mtMessagesList, ...items], 'mtid');
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
        this.panelColumns['estimatedAmount'],
        this.panelColumns['settlementDate'],
        this.panelColumns['beneficiaryIban'],
        this.panelColumns['messageType'],
        this.panelColumns['messageReference'],
        this.panelColumns['generationIznes'],
        this.panelColumns['fundProvider'],
        this.panelColumns['sendToProvider'],
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
    this.getMTDashboardList();
  }

  ngOnDestroy(): void {
    this.cdr.detach();
  }

  }
  
