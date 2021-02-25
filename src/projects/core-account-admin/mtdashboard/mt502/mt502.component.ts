import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MultilingualService } from '@setl/multilingual';
import { MtdashboardService } from '../service';

@Component({
  selector: 'app-mt502',
  templateUrl: './mt502.component.html',
  styleUrls: ['./mt502.component.scss']
})

export class Mt502Component implements OnInit, OnDestroy {

  panelDef = {};
  panelColumns = {};
  centralizingAgentList = [];
  language = 'en';
  isPeriod = true;
  selectedCentralizingAgent: number = null;
  fundItems: any;
  placeFiltersFormGroup: FormGroup;
  readonly itemPerPage = 10;
  rowOffset = 0;

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
        dataSource: 'orderType',
        sortable: true,
      },
      quantity: {
        label: this.translate.translate('Quantity'),
        dataSource: 'quantity',
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
        label: this.translate.translate('Generation IZNES'),
        dataSource: 'generationIznes',
        sortable: true,
      },
      centralizingAgent: {
        label: this.translate.translate('Centralizing Agent'),
        dataSource: 'centralizingAgent',
        sortable: true,
      },
      sendToCentralizer: {
        label: this.translate.translate('Send to centralizer'),
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
      }

    };
  }

  initFilterForm() {
    this.placeFiltersFormGroup = this.fb.group({
      isinCode: [''],
      shareName: [''],
      centralizingAgent: [0],
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
      mtType: 'mt502',
      isinCode: this.placeFiltersFormGroup.controls['isinCode'].value,
      fundShareName: this.placeFiltersFormGroup.controls['shareName'].value,
      centralizingAgentId: this.placeFiltersFormGroup.controls['centralizingAgent'].value.length ? this.selectedCentralizingAgent : null,
      fromDate: this.placeFiltersFormGroup.controls['fromDate'].value,
      toDate: this.placeFiltersFormGroup.controls['toDate'].value,
    };

    this.mtDashboardService.defaultRequestMTDashboardList(request, (data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });

    console.log(request);
  }

  initPanelDefinition() {
    this.panelDef = {
      columns: [
        this.panelColumns['date'],
        this.panelColumns['fundShareName'],
        this.panelColumns['isin'],
        this.panelColumns['orderType'],
        this.panelColumns['quantity'],
        this.panelColumns['messageType'],
        this.panelColumns['messageReference'],
        this.panelColumns['cutoffDate'],
        this.panelColumns['generationIznes'],
        this.panelColumns['centralizingAgent'],
        this.panelColumns['sendToCentralizer'],
        this.panelColumns['acknowledged'],
        this.panelColumns['providerTreatment'],
        this.panelColumns['comments'],
      ],

      open: true,
      data: [],
      count: 0,
    };
  }

  ngOnDestroy(): void {
    this.cdr.detach();
    //this.subscriptions.map(subscription => subscription.unsubscribe());
  }
}
