import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement, Directive, Input, Pipe, PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';

import { NgRedux } from '@angular-redux/store';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { Location } from '@angular/common';
import { SelectModule } from '@setl/utils/index';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';

import { OfiInviteInvestorsComponent } from './component';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { MultilingualService } from '@setl/multilingual';
import { kycEnums } from '../config';
import { OfiFundDataService } from '../../ofi-data-service/product/fund/ofi-fund-data-service';
import { Observable } from "rxjs/Rx";

const locationSpy = jasmine.createSpyObj('Location', ['back']);
const ofiKycServiceSpy = jasmine.createSpyObj(
    'OfiKycService',
    ['getInvitationsByUserAmCompany', 'sendInvestInvitations'],
);
const ngReduxSpy = jasmine.createSpyObj('NgRedux', ['dispatch']);
const multilingualServiceSpy = jasmine.createSpyObj('MultilingualService', ['translate']);

export class OfiFundDataServiceStub {

    public getFundSelectList(): Observable<any[]> {
        return Observable.of([]);
    }
}

// Stub for translate
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

describe('OfiInviteInvestorsComponent', () => {

    let comp: OfiInviteInvestorsComponent;
    let fixture: ComponentFixture<OfiInviteInvestorsComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                OfiInviteInvestorsComponent,
                TranslatePipe,
            ],
            imports: [
                ReactiveFormsModule,
                ClarityModule,
                SelectModule,
            ],
            providers: [
                AlertsService,
                ToasterService,
                { provide: Location, useValue: locationSpy },
                { provide: OfiKycService, useValue: ofiKycServiceSpy },
                { provide: OfiFundDataService, useClass: OfiFundDataServiceStub },
                { provide: NgRedux, useValue: ngReduxSpy },
                { provide: MultilingualService, useValue: multilingualServiceSpy },
                { provide: 'kycEnums', useValue: kycEnums },
            ],
        }).compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(OfiInviteInvestorsComponent);

        comp = fixture.componentInstance;
        comp.inviteItems = [
            {
                inviteSent: '2018-05-22',
                tokenUsedAt: '2018-05-22',
                email: 'albert.oudompheng@setl.io',
                companyName: 'toto',
                lastName: 'ding dong',
                firstName: 'albert',
                invitedBy: 'am erica',
                kycStarted: '2018-05-22',
                invitationLink: 'link',
                status: 2,
            },
        ];

        tick();
        fixture.detectChanges();

        de = fixture.debugElement.query(By.css('div.wrapper'));
        el = de.nativeElement;

    }));

    describe('structure', () => {
        describe('invites recap', () => {
            it('should render a datagrid', () => {
                const datagridEl = fixture.debugElement.queryAll(By.css('clr-datagrid'));
                expect(datagridEl.length).toBe(1);
            });

            it('should have a header with text: "Invites recap:"', () => {
                const headerEl = fixture.debugElement.queryAllNodes(By.css('h2'));
                expect(headerEl.length).toBe(1);
                expect(headerEl[0].nativeNode.innerText).toEqual('Invites Recap');
            });

            it('should have a subtitle with text: "Please find below invitations that have been sent to investors:"', () => {
                const subtitleEl = fixture.debugElement.queryAllNodes(By.css('p.subhead'));
                expect(subtitleEl.length).toBe(1);
                expect(subtitleEl[0].nativeNode.innerText).toEqual('Please find below invitations that have been sent to investors:');
            });

            it('should have the columns: Date Sent, Invitation Status, Email Address, Company Name, Last Name, First Name, Invitation Sent By, Date KYC Started, Invitation Link, KYC Status', () => {
                const datagridColumnEls = fixture.debugElement.queryAll(By.css('clr-dg-column'));
                expect(datagridColumnEls.length).toBe(10);

                expect(datagridColumnEls[0].nativeNode.innerText).toContain('Date Sent');
                expect(datagridColumnEls[1].nativeNode.innerText).toContain('Invitation Status');
                expect(datagridColumnEls[2].nativeNode.innerText).toContain('Email Address');
                expect(datagridColumnEls[3].nativeNode.innerText).toContain('Company Name');
                expect(datagridColumnEls[4].nativeNode.innerText).toContain('Last Name');
                expect(datagridColumnEls[5].nativeNode.innerText).toContain('First Name');
                expect(datagridColumnEls[6].nativeNode.innerText).toContain('Invitation Sent By');
                expect(datagridColumnEls[7].nativeNode.innerText).toContain('Date KYC Started');
                expect(datagridColumnEls[8].nativeNode.innerText).toContain('Invitation Link');
                expect(datagridColumnEls[9].nativeNode.innerText).toContain('KYC Status');
            });
        });
    });

    describe('interface', () => {
        describe('invites recap', () => {
            it('should display the correct formatted data', () => {
                const datagridRowEls = fixture.debugElement.queryAll(By.css('clr-dg-cell'));
                expect(datagridRowEls.length).toBe(10);

                expect(datagridRowEls[0].nativeNode.innerText).toContain(comp.inviteItems[0].inviteSent);
                expect(datagridRowEls[1].nativeNode.innerText).toContain(comp.inviteItems[0].tokenUsedAt);
                expect(datagridRowEls[2].nativeNode.innerText).toContain(comp.inviteItems[0].email);
                expect(datagridRowEls[3].nativeNode.innerText).toContain(comp.inviteItems[0].companyName);
                expect(datagridRowEls[4].nativeNode.innerText).toContain(comp.inviteItems[0].lastName);
                expect(datagridRowEls[5].nativeNode.innerText).toContain(comp.inviteItems[0].firstName);
                expect(datagridRowEls[6].nativeNode.innerText).toContain(comp.inviteItems[0].invitedBy);
                expect(datagridRowEls[7].nativeNode.innerText).toContain(comp.inviteItems[0].kycStarted);
                expect(datagridRowEls[8].nativeNode.innerText).toContain(comp.inviteItems[0].invitationLink);
                expect(datagridRowEls[9].nativeNode.innerText).toContain(comp.enums.status[comp.inviteItems[0].status].label);
            });
        });
    });
});
