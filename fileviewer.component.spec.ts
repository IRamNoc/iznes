import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { HttpModule } from '@angular/http';
import { MemberSocketService } from '@setl/websocket-service';
import { ClarityModule } from 'clarity-angular';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { APP_CONFIG } from '@setl/utils';
import { FileViewerComponent } from './fileviewer.component';
import { PdfService } from "../core-req-services/pdf/pdf.service";
import { PdfServiceFixture } from "../test-fixtures/core-req-services/pdf/pdf-service-fixture";

describe('FileViewerComponent', () => {

    let component: FileViewerComponent;
    let fixture: ComponentFixture<FileViewerComponent>;
    let sanitizer: DomSanitizer;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ClarityModule, HttpModule ],
            declarations: [ FileViewerComponent ],
            providers: [
                AlertsService,
                {provide: PdfService, useClass: PdfServiceFixture},
                { provide: MemberSocketService, useValue: {hostname: '127.0.0.1', port: '9788', path: '/'} },
                NgRedux,
                {
                    provide: APP_CONFIG,
                    useValue: {
                        MEMBER_NODE_CONNECTION: {
                            host: '127.0.0.1',
                            port: 9788
                        }
                    }
                }
            ]
        });
        fixture = TestBed.createComponent(FileViewerComponent);
        component = fixture.componentInstance;
        sanitizer = new DomSanitizer();
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

    it ('should create a valid file download URL given a fileHash', () => {
        component.token = 'token';
        component.userId = 'userId';
        component.walletId = 'walletId';
        component.fileHash = 'fileHash';
        let expectedFileUrl = sanitizer.bypassSecurityTrustResourceUrl(
            component.baseUrl +
            '/mn/file?method=retrieve&userId=userId&walletId=walletId&token=token&fileHash=fileHash'
        );
        fixture.detectChanges();
        expect(component.fileUrl === '' || component.fileUrl === null).toBeFalsy();
        expect(sanitizer.sanitize(SecurityContext.RESOURCE_URL, component.fileUrl)).toBe(expectedFileUrl);
    });

    it ('should create a valid file validation URL given a fileHash', () => {
        component.token = 'token';
        component.userId = 'userId';
        component.walletId = 'walletId';
        component.fileHash = 'fileHash';
        let expectedValidateUrl = sanitizer.bypassSecurityTrustResourceUrl(
            component.baseUrl +
            '/mn/file?method=validate&userId=userId&walletId=walletId&token=token&fileHash=fileHash'
        );
        fixture.detectChanges();
        expect(component.fileUrl === undefined).toBeFalsy();
        expect(component.validateUrl === '' || component.validateUrl === null).toBeFalsy();
        expect(sanitizer.sanitize(SecurityContext.RESOURCE_URL, component.validateUrl)).toBe(expectedValidateUrl);
    });

    it ('should create a valid file download URL given a pdfId', () => {
        component.token = 'token';
        component.userId = 'userId';
        component.walletId = 'walletId';
        component.pdfId = 'pdfId';
        let expectedFileUrl = sanitizer.bypassSecurityTrustResourceUrl(
            component.baseUrl +
            '/mn/file?method=retrieve&userId=userId&walletId=walletId&token=token&fileHash=fileHash'
        );
        component.openFileModal();
        fixture.detectChanges();
        console.log('File URL : ', component.fileUrl);
        spyOn(component, 'getPdf');
        expect(component.getPdf).toHaveBeenCalled();

        expect(typeof component.fileUrl === 'undefined').toBeFalsy();
        expect(component.fileUrl === '' || component.fileUrl === null).toBeFalsy();
        expect(sanitizer.sanitize(SecurityContext.RESOURCE_URL, component.fileUrl)).toBe(expectedFileUrl);
    });
});
