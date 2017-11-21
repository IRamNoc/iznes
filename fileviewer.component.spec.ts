import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {ChangeDetectorRef, DebugElement} from '@angular/core';

import { NgRedux } from '@angular-redux/store';
import { HttpModule } from '@angular/http';
import { MemberSocketService } from '@setl/websocket-service';
import { ClarityModule } from 'clarity-angular';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { PdfService } from '@setl/core-req-services/pdf/pdf.service';
import {APP_CONFIG} from '@setl/utils';
import { FileViewerComponent } from './fileviewer.component';

describe('FileViewerComponent', () => {

    let comp:    FileViewerComponent;
    let fixture: ComponentFixture<FileViewerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ClarityModule, HttpModule ],
            declarations: [ FileViewerComponent ],
            providers: [ NgRedux, AlertsService, MemberSocketService, PdfService, {provide: APP_CONFIG, useValue: 'abc'} ]
        });
        fixture = TestBed.createComponent(FileViewerComponent);
        comp = fixture.componentInstance;
    });

    it('should display button', () => {
        //fixture.detectChanges();
    });
});
