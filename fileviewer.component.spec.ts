import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/lib/testing';
import { MemberSocketService } from '@setl/websocket-service';
import { ClarityModule } from '@clr/angular';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { APP_CONFIG } from '@setl/utils';
import { FileViewerComponent } from './fileviewer.component';
import { FileViewerPreviewComponent } from './preview-modal/component';
import { FileViewerPreviewService } from './preview-modal/service';
import { PdfService } from '@setl/core-req-services/pdf/pdf.service';
import { PdfMockService } from '@setl/core-req-services/pdf/pdf.mock.service';
import { SecurityContext } from '@angular/core';
import { SagaHelper, FileDownloader, SetlServicesModule } from '@setl/utils';
import { HttpClientModule } from '@angular/common/http';
import { SetlPipesModule } from '@setl/utils';

let origRunAsync;

describe('FileViewerComponent', () => {

    beforeAll(() => {
        origRunAsync = SagaHelper.runAsync;

    });
    afterAll(() => {
        SagaHelper.runAsync = origRunAsync;
    });

    let component: FileViewerComponent;
    let fixture: ComponentFixture<FileViewerComponent>;
    const pdfMockService = new PdfMockService('', '');
    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [ClarityModule, HttpClientModule, SetlPipesModule],
            declarations: [FileViewerComponent, FileViewerPreviewComponent],
            providers: [
                AlertsService,
                FileViewerPreviewService,
                { provide: PdfService, useValue: pdfMockService },
                { provide: MemberSocketService, useValue: { hostname: '127.0.0.1', port: '9788', path: '/' } },
                { provide: NgRedux, useClass: MockNgRedux },
                {
                    provide: APP_CONFIG,
                    useValue: {
                        MEMBER_NODE_CONNECTION: {
                            host: '127.0.0.1',
                            port: 443,
                        },
                    },
                },
                FileDownloader,
                SetlServicesModule,
            ],
        });

        fixture = TestBed.createComponent(FileViewerComponent);
        component = fixture.componentInstance;
    });

    it('should display message given no fileHash or pdfID', () => {
        fixture.detectChanges();
        const divs = fixture.nativeElement.querySelectorAll('div');
        expect(divs.length).toBe(1);
        const message = divs[0].innerHTML;
        expect(message.trim()).toBe('No File');
    });

    it('should display button given a fileHash or pdfID', () => {
        component.fileHash = 'fileHash';
        fixture.detectChanges();
        const buttons = fixture.nativeElement.querySelectorAll('button');
        expect(buttons.length).toBe(1);
    });

});
