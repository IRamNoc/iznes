import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MultilingualService } from '@setl/multilingual';
import { MtdashboardService } from '../service';
import { ToasterService, Toast } from 'angular2-toaster';
import * as moment from 'moment-timezone';

/* Low dash. */
import * as _ from 'lodash';
import { select } from '@angular-redux/store';
import { OfiFundShareService } from '@setl/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mt502',
  templateUrl: './mt502.component.html',
  styleUrls: ['./mt502.component.scss']
})

export class Mt502Component implements OnInit, OnDestroy {
  toastTimer;
  timerToast: Toast;
  toasterConfig: any = {
      type: 'warning',
      title: '',
      timeout: 0,
      tapToDismiss: false,
  };
  shareList: any[] = [];  
  shareNameList = [];
  filteredShareList: any[] = [];
  subscriptions: Array<Subscription> = [];
  selectedFundShareName: any = "";
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
    private cdr: ChangeDetectorRef,
    private mtDashboardService: MtdashboardService,    
    private ofiFundShareService: OfiFundShareService,
    private toaster: ToasterService,
    @Inject('product-config') productConfig,
  ) {
    this.ofiFundShareService.fetchIznesShareList();
    this.fundItems = productConfig.fundItems;
    this.centralizingAgentList = this.fundItems.custodianBankItems;
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
      fundShareName: {
        label: this.translate.translate('Fund Share'),
        dataSource: 'fundShareName',
        sortable: true,
      },
      isin: {
        label: this.translate.translate('ISIN'),
        dataSource: 'isin',
        sortable: true,
      },
      orderType: {
        label: this.translate.translate('Order Type'),
        dataSource: 'typeOrder',
        sortable: true,
      },
      quantity: {
        label: this.translate.translate('Quantity'),
        dataSource: 'pQuantity',
        sortable: true,
      },
      amount: {
        label: this.translate.translate('Amount'),
        dataSource: 'pAmount',
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
      cutoffDate: {
        label: this.translate.translate('Cutoff'),
        dataSource: 'cutoffDate',
        sortable: true,
      },
      generationIznes: {
        label: this.translate.translate('Generation IZNES (GMT)'),
        dataSource: 'generationIznes',
        sortable: true,
      },
      centralizingAgent: {
        label: this.translate.translate('Centralizing Agent'),
        dataSource: 'centralizingAgent',
        sortable: true,
      },
      sendToCentralizer: {
        label: this.translate.translate('Send to centralizer (GMT)'),
        dataSource: 'sendToCentralizer',
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
      centralizingAgent: [0],
      fromDate: [moment()],
      toDate: [moment()],
    });
  }

  handleDropdownCentralizingAgentSelect(event) {
    this.selectedCentralizingAgent = this.centralizingAgentList[event.id].id;
  }

  getMTDashboardList(isSearch: Boolean) {
    if (isSearch) {
      this.rowOffset = 0;
    }

    let shareName = this.placeFiltersFormGroup.controls['shareName'].value;
    let centralizingAgentId=this.placeFiltersFormGroup.controls['centralizingAgent'].value;

    const request = {
      itemPerPage: this.itemPerPage,
      rowOffset: this.rowOffset,
      mtType: 'mt502',
      isinCode: this.placeFiltersFormGroup.controls['isinCode'].value,
      fundShareName: shareName[0] ? shareName[0].text : "",
      centralizingAgent: centralizingAgentId[0] ? centralizingAgentId[0].id : 0, 
      fromDate: moment(this.placeFiltersFormGroup.controls['fromDate'].value).format('YYYY-MM-DD 00:00:00'),
      toDate: moment(this.placeFiltersFormGroup.controls['toDate'].value).format('YYYY-MM-DD 23:55:00'),
    };

    this.mtDashboardService.requestMTDashboardList(request).then((result) => {
      const data = result[1].Data;
      if (data.error) {
        return this.toaster.pop('error', this.translate.translate('There is a problem with the request.'));
      } else {
        const items = data.map((item) => {
          const mtMetadata = JSON.parse(item.mtMsgPayload);
          const timezone = mtMetadata.metadata.ordertype === 's' ? item.subscriptionTimezone : item.redemptionTimezone;

          return {
            date: moment(new Date(item.orderDate)).format('YYYY-MM-DD'),
            centralizingAgent: _.get(_.find(this.centralizingAgentList, { id: item.centralizingAgentId }), 'text', this.translate.translate('none')),
            typeOrder: mtMetadata.metadata.ordertype === 's' ? this.translate.translate("Subscription") : this.translate.translate("Redemption"),
            messageType: `MT502 (${mtMetadata.metadata.msgtype === "quantity" ? this.translate.translate("Quantity") : this.translate.translate("Amount")})`,
            cutoffDate: mtMetadata.metadata.cutoffDate,
            generationIznes: moment(item.orderDate).tz(timezone).format('HH[h]mm'),
            sendToCentralizer: _.get(item, 'sendToCentralizingAgent') ? moment(new Date(item.sendToCentralizingAgent)).tz(timezone).format('HH[h]mm') : this.translate.translate("Unknown"),
            pQuantity: _.get(mtMetadata, 'mtMsg.orderedQuantity.value', '/'),
            pAmount: _.get(mtMetadata, 'mtMsg.orderedAmount.value', '/'),
            messageReference: mtMetadata.mtMsg.sendersMessageReference,
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
    let parsedMessage = '';
    try {
      let splitMsg = mtMessage.mtRawmsg.split('{');
      splitMsg.forEach((line, index) => {
        if (index === 0) return;
        parsedMessage += `<div><h6><b>Block ${line.charAt(0)}</b></h6><pre class="p6">{${line}</pre></div>`
      });
    } catch(e) {
      parsedMessage = '<div><h6>Cannot parse this MT Message in detailed</h6></div>';
      console.error('Enable to parse mt message');
    };

    this.mtModal = {
        filename: (mtMessage.mtFilename).substring(0, mtMessage.mtFilename.length - 4) || 'untitled',
        body: (parsedMessage),
        bodyFull: (mtMessage.mtRawmsg),
    };
}

  closeModal(): void {
    this.mtModal = {};
    this.isModalDisplayed = false;
  }

  downloadFile(): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.mtModal.bodyFull));
    element.setAttribute('download', this.mtModal.filename);
    element.style.display = 'none'
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  initPanelDefinition() {
    this.panelDef = {
      columns: [
        this.panelColumns['date'],
        this.panelColumns['fundShareName'],
        this.panelColumns['isin'],
        this.panelColumns['orderType'],
        this.panelColumns['quantity'],
        this.panelColumns['amount'],
        this.panelColumns['messageType'],
        this.panelColumns['messageReference'],
        this.panelColumns['cutoffDate'],
        this.panelColumns['generationIznes'],
        this.panelColumns['centralizingAgent'],
        this.panelColumns['sendToCentralizer'],
        this.panelColumns['acknowledged'],
        this.panelColumns['providerTreatment'],
        this.panelColumns['comments'],
        this.panelColumns['action']
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
    this.rowOffset = this.currentPage - 1;
    if (!state.page || this.firstInit) {
      return;
    }

    this.getMTDashboardList(false);
  }


  ngOnDestroy(): void {
    this.cdr.detach();
  }
}
