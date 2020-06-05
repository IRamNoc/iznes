import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogService } from '@setl/utils';
import { MultilingualService } from '@setl/multilingual';

@Component({
  selector: 'app-create-transfer',
  templateUrl: './create-transfer.component.html',
  styleUrls: ['./create-transfer.component.scss']
})
export class CreateTransferComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private redux: NgRedux<any>,
    private logService: LogService,
    public translate: MultilingualService,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }

}
