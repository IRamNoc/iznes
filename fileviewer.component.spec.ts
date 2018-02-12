import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DomSanitizer} from '@angular/platform-browser';
import {NgRedux} from '@angular-redux/store';
import {MockNgRedux} from "@angular-redux/store/lib/testing";
import {MemberSocketService} from '@setl/websocket-service';
import {ClarityModule} from '@clr/angular';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {APP_CONFIG} from '@setl/utils';
import {FileViewerComponent} from './fileviewer.component';
import {PdfService} from '@setl/core-req-services/pdf/pdf.service';
import {PdfMockService} from '@setl/core-req-services/pdf/pdf.mock.service';
import {SecurityContext} from "@angular/core";
import {SagaHelper} from '@setl/utils';

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
            imports: [ClarityModule],
            declarations: [FileViewerComponent],
            providers: [
                AlertsService,
                {provide: PdfService, useValue: pdfMockService},
                {provide: MemberSocketService, useValue: {hostname: '127.0.0.1', port: '9788', path: '/'}},
                {provide: NgRedux, useClass: MockNgRedux},
                {
                    provide: APP_CONFIG,
                    useValue: {
                        MEMBER_NODE_CONNECTION: {
                            host: '127.0.0.1',
                            port: 443
                        }
                    }
                }
            ]
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

    it('should create a valid file download URL given a fileHash', () => {
        component.token = 'token';
        component.userId = 'userId';
        component.walletId = 'walletId';
        component.fileHash = 'fileHash';
        const expectedFileUrl = component.sanitizer.bypassSecurityTrustResourceUrl(
            component.baseUrl +
            '/mn/file?method=retrieve&downloadId=downloadId&walletId=walletId'
        ).toString();
        component.openFileModal().then(() => {
                fixture.detectChanges();
                expect(component.fileUrl === '' || component.fileUrl === null).toBeFalsy();
                expect(component.sanitizer.sanitize(SecurityContext.RESOURCE_URL, component.fileUrl)).toBe(expectedFileUrl);
            },
            () => {
            });
    });

    it('should create a valid file download URL given a pdfId', () => {
        component.token = 'token';
        component.userId = 'userId';
        component.walletId = 'walletId';
        component.pdfId = 'pdfId';
        component.fileHash = 'fileHash';
        const expectedFileUrl = component.sanitizer.bypassSecurityTrustResourceUrl(
            component.baseUrl +
            '/mn/file?method=retrieve&downloadId=downloadId&walletId=walletId'
        ).toString();
        spyOn(pdfMockService, 'getPdf').and.callThrough();
        component.openFileModal().then(() => {
                fixture.detectChanges();
                expect(pdfMockService.getPdf).toHaveBeenCalled();
                expect(typeof component.fileUrl === 'undefined').toBeFalsy();
                expect(component.fileUrl === '' || component.fileUrl === null).toBeFalsy();
                expect(component.sanitizer.sanitize(SecurityContext.RESOURCE_URL, component.fileUrl)).toBe(expectedFileUrl);
            },
            () => {
            });

    });
});
