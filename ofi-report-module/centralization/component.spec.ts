import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CentralizationReportComponent} from './component';
import {ClarityModule} from '@clr/angular';
import {SetlComponentsModule} from '@setl/utils/components';

describe('CentralizationReportComponent', () => {

    let comp: CentralizationReportComponent;
    let fixture: ComponentFixture<CentralizationReportComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const resetTestingModule = TestBed.resetTestingModule;

    beforeAll((done) => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [CentralizationReportComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                ClarityModule,
                SetlComponentsModule,
            ],
            providers: [],
        }).compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CentralizationReportComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement.query(By.css('clr-tab'));
        el = de.nativeElement;
    });

    // describe('structure', () => {
    //     it('should render a title with the wording: \'Centralization Report: All Shares\'', () => {
    //         // const headerEl = fixture.debugElement.query(By.css('div')).nativeElement;
    //         // expect(headerEl.innerText.trim()).toEqual('Centralization Report: All Shares');
    //     });
    // });
});
