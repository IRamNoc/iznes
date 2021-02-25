import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MultilingualService } from '@setl/multilingual';
@Component({
  selector: 'app-mt502',
  templateUrl: './mt502.component.html',
  styleUrls: ['./mt502.component.scss']
})
export class Mt502Component implements OnInit {

  panelDef = {};
  panelColumns = {};

  constructor(public translate: MultilingualService) {
  }

  ngOnInit() {
    this.initPanelColumns();
    this.initPanelDefinition();
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
      centralizer: {
        label: this.translate.translate('Centralizer'),
				dataSource: 'centralizer',
				sortable: true,
      },
      send_to_centralizer: {
        label: this.translate.translate('Send to centralizer'),
				dataSource: 'send_to_centralizer',
				sortable: true,
      },
      acknowledged: {
        label: this.translate.translate('Acknowledged'),
				dataSource: 'acknowledged',
				sortable: true,
      },
      providertreatment: {
        label: this.translate.translate('Providertreatment'),
				dataSource: 'providertreatment',
				sortable: true,
      },
      comments: {
        label: this.translate.translate('Comments'),
				dataSource: 'comments',
				sortable: true,
      }
      
		};
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
        this.panelColumns['centralizer'],
        this.panelColumns['send_to_centralizer'],
        this.panelColumns['acknowledged'],
        this.panelColumns['providertreatment'],
        this.panelColumns['comments'],
      ],
    
      open: true,
      data: [],
      count: 0,
    };
  }
}
