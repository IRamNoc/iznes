import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MultilingualService } from '@setl/multilingual';
import { MtdashboardService } from '../service';
import { ToasterService, Toast } from 'angular2-toaster';
import * as moment from 'moment-timezone';

/* Low dash. */
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { select } from '@angular-redux/store';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';

@Component({
  selector: 'app-mt10x-am',
  templateUrl: './mt10x-am.component.html',
  styleUrls: ['./mt10x-am.component.scss']
})
export class Mt10xAmComponent implements OnInit, OnDestroy {
  toastTimer;
  timerToast: Toast;
  toasterConfig: any = {
      type: 'warning',
      title: '',
      timeout: 0,
      tapToDismiss: false,
  };
  shareList: any[] = [];
  filteredShareList: any[] = [];
  subscriptions: Array<Subscription> = [];
  selectedFundShareName: any = "";
  panelDef: any = {};
  panelColumns = {};
  centralizingAgentList = [];
  shareNameList = [];
  depositoryList = [];
  language = 'en';
  isPeriod = true;
  selectedCentralizingAgent: number = null;
  selectedShare: any = "";
  selectedClient: any = "";
  selectedDepsoitory: number = null;
  fundItems: any;
  mtMessagesList = [];
  placeFiltersFormGroup: FormGroup;
  total: number = 0;
  currentPage: number = 1;
  lastPage: number = 0;
  readonly itemPerPage = 10;
  rowOffset = 0;
  firstInit: boolean = true;
  isModalDisplayed = false;
  mtModal: any = {};

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
    private changeDetectorRef: ChangeDetectorRef,
    private mtDashboardService: MtdashboardService,
    private ofiFundShareService: OfiFundShareService,
    private toaster: ToasterService,
    @Inject('product-config') productConfig,
  ) {
    this.ofiFundShareService.fetchIznesShareList();
    this.fundItems = productConfig.fundItems;
    this.centralizingAgentList = this.fundItems.centralizingAgentItems;
    this.depositoryList = this.fundItems.custodianBankItems;
  }

  ngOnInit() {
    this.initFilterForm();
    this.initPanelColumns();
    this.initPanelDefinition();
    this.getMTDashboardList(false);
    this.subscriptions.push(this.fundShareObs.subscribe(shares => this.getShareList(shares)));
  }

  getShareList(shares) {
    this.shareList = shares;
    this.shareNameList = Object.keys(this.shareList).map((key) => {
      return {
        id: key,
        text: this.shareList[key].fundShareName,
      };
    });
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
      },
      action: {
        label: this.translate.translate('Action'),
        dataSource: 'mtid',
        type: 'button',
      }
    };
  }

  initFilterForm() {
    this.placeFiltersFormGroup = this.fb.group({
      isinCode: [''],
      shareName: [''],
      depositary: [''],
      fromDate: [moment()],
      toDate: [moment()],
    });
  }

  handleDropdownCentralizingAgentSelect(event) {
    this.selectedCentralizingAgent = this.centralizingAgentList[event.id].id;
  }
  handleDropdownshareNameSelect(event) {
    this.selectedShare = event.text;
  }
  handleDropdownDepositorySelect(event) {
    this.selectedDepsoitory = event.id;
    
  }

  getMTDashboardList(isSearch: Boolean) {
    if (isSearch) {
      this.rowOffset = 0;
    }

    let shareName = this.placeFiltersFormGroup.controls['shareName'].value;
    let depositaryValue = this.placeFiltersFormGroup.controls['depositary'].value;

    const request = {
      itemPerPage: this.itemPerPage,
      rowOffset: this.rowOffset,
      mtType: 'mt101',
      isinCode: this.placeFiltersFormGroup.controls['isinCode'].value,
      fundShareName: shareName[0] ? shareName[0].text : "",
      depositary: depositaryValue[0] ? depositaryValue[0].id : "",
      clientName: "", // TODO: investor name search filter
      fromDate: moment(this.placeFiltersFormGroup.controls['fromDate'].value).format('YYYY-MM-DD 00:00:00'),
      toDate: moment(this.placeFiltersFormGroup.controls['toDate'].value).format('YYYY-MM-DD 23:55:00'),
    };


    this.mtDashboardService.requestAssetManagerDashboardList(request).then((result) => {
      const data = result[1].Data;
      if (data.error) {
        return this.toaster.pop('error', this.translate.translate('There is a problem with the request.'));
      } else {
        const items = data.map((item) => {        
          const mtMetadata = _.attempt(JSON.parse.bind(null, item.mtMsgPayload));
          const messageType = _.get(mtMetadata, 'mtMsg.type', 'N/A');
          const typeOrder = _.get(mtMetadata, 'metadata.ordertype', 'N/A');
          const timezone = typeOrder === 's' ? item.subscriptionTimezone : item.redemptionTimezone;
          const  amount = (messageType == "MT103") ?
            _.get(mtMetadata, 'mtMsg.instructedAmount.amount', 'N/A') :
            _.get(mtMetadata, 'mtMsg.transactionAmount.amount', 'N/A')
          ;

          return {
            date: moment(new Date(item.orderDate)).format('YYYY-MM-DD'),
            settlementDate: moment(new Date(item.orderDate)).format('YYYY-MM-DD'),
            fundProvider: _.get(_.find(this.centralizingAgentList, { id: item.fundAdministratorID }), 'text', this.translate.translate('none')),
            typeOrder:  typeOrder === 's' ? this.translate.translate("Subscription") : this.translate.translate("Redemption"),
            investorName: _.get(mtMetadata, 'mtMsg.beneficiaryCustomer.details[0]', 'N/A'),
            generationIznes: moment(item.orderDate).tz(timezone).format('HH[h]mm'),
            amount:  amount,
            investorPortfolioLabel: _.get(mtMetadata, 'metadata.subPortfolioName', 'N/A'),
            messageType: messageType,
            beneficiaryIban: _.get(mtMetadata, 'mtMsg.beneficiaryCustomer.isin', 'N/A'),
            messageReference: _.get(mtMetadata, 'metadata.orderRef', 'N/A'),
            ...item
          }
        });

        if (isSearch) {
          this.mtMessagesList = items;
        } else {
          this.mtMessagesList = _.uniqBy([...this.mtMessagesList, ...items], 'mtid');
        }

        this.panelDef.data = this.mtMessagesList;
        this.total = _.get(data, '[0].totalResults', 0);
        this.lastPage = Math.ceil(this.total / this.itemPerPage);
        this.detectChanges(true);
        this.firstInit = false;
      };
    })
  }

  viewMTMessage(mtid): void {
    this.isModalDisplayed = true;
    
    const mtMessage = _.find(this.mtMessagesList, { mtid });

    this.mtModal = {
        title: (mtMessage.mtFilename).substring(0, mtMessage.mtFilename.length - 4),
        body: (mtMessage.mtRawmsg).replace(` :`, '<br/>:'),
    };
  }

  closeModal(): void {
    this.mtModal = {};
    this.isModalDisplayed = false;
  }

  initPanelDefinition() {
    this.panelDef = {
      columns: [
        this.panelColumns['date'],
        // this.panelColumns['investorName'],
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
        this.panelColumns['acknowledged'],
        this.panelColumns['providerTreatment'],
        this.panelColumns['comments'],
        this.panelColumns['action']
      ],
      open: true,
    };
  }

  detectChanges(detect = false) {
    this.changeDetectorRef.markForCheck();
    if (detect) {
      this.changeDetectorRef.detectChanges();
    }
  }

  refresh(state) {
    this.rowOffset = this.currentPage - 1;
    if (!state.page || this.firstInit) {
      return;
    }

    this.getMTDashboardList(false);
  }

  ngOnDestroy(): void {
    this.changeDetectorRef.detach();
  }

}

