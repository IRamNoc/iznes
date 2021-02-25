import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MultilingualService } from '@setl/multilingual';
@Component({
  selector: 'app-mt10x-am',
  templateUrl: './mt10x-am.component.html',
  styleUrls: ['./mt10x-am.component.scss']
})
export class Mt10xAmComponent implements OnInit {

  filtersForm: FormGroup;
  language = 'en';
  dateFrom = '';
  dateTo = '';
  fundSpecificDates = [];
  fundsList: Array<any> = [];
  constructor(private fb: FormBuilder, public translate: MultilingualService) {
    this.createFiltersForm();
    this.fundSpecificDates = [
      { id: 0, text: translate.translate('Specific NAV Date') },
      { id: 1, text: translate.translate('Specific Settlement Date') },
      { id: 2, text: translate.translate('Specific NAV Period') },
      { id: 3, text: translate.translate('Specific Settlement Period') },
  ];
  }
 
  ngOnInit() {
  }
 
  fromConfigDate = {
    firstDayOfWeek: 'mo',
    format: 'YYYY-MM-DD',
    closeOnSelect: true,
    disableKeypress: true,
    locale: this.language,
    isDayDisabledCallback: (thisDate) => {
      // make sure the dateFrom that greater than dateTo can not be selected
      if (!!thisDate && this.filtersForm.controls['dateTo'].value !== '') {
        return (thisDate.diff(this.filtersForm.controls['dateTo'].value) > 0);
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
      if (!!thisDate && this.filtersForm.controls['dateFrom'].value !== '') {
        return (thisDate.diff(this.filtersForm.controls['dateFrom'].value) < 0);
      }
      return false;
    },
  };
  createFiltersForm() {
    const today = new Date();
    const yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().slice(0, 10);
    const nextWeek = new Date(today.setDate(today.getDate() + 7)).toISOString().slice(0, 10);
    this.filtersForm = this.fb.group({
      selectList: [
        '',
      ],
      specificDate: [
        '',
      ],
      dateFrom: [
        '',
      ],
      dateTo: [
        '',
      ],codeISIN:[
        '',
      ],
    });
    this.dateFrom = yesterday;
    this.dateTo = nextWeek;
    this.filtersForm.get('specificDate').patchValue(
      [{
        id: 2,
        text: this.translate.translate('Specific NAV Period'),
      }],
      { emitEvent: false },
    );
    this.filtersForm.get('dateFrom').patchValue(yesterday, { emitEvent: false }); 
    this.filtersForm.get('specificDate').updateValueAndValidity();
    this.filtersForm.get('dateFrom').updateValueAndValidity();
    this.filtersForm.get('dateTo').updateValueAndValidity();
  }


}
