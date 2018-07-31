// import {ComponentFixture, TestBed} from '@angular/core/testing';
// import {DebugElement} from '@angular/core';
// import {By} from '@angular/platform-browser';
//
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
//
// import {PrecentralisationReportComponent} from './component';
// import {ClarityModule} from '@clr/angular';
// import {SetlComponentsModule} from '@setl/utils/components';
//
// describe('PrecentralisationReportComponent', () => {
//
//     let comp: PrecentralisationReportComponent;
//     let fixture: ComponentFixture<PrecentralisationReportComponent>;
//     let de: DebugElement;
//     let el: HTMLElement;
//
//     const resetTestingModule = TestBed.resetTestingModule;
//
//     beforeAll((done) => (async () => {
//         TestBed.resetTestingModule();
//         TestBed.configureTestingModule({
//             declarations: [PrecentralisationReportComponent],
//             imports: [
//                 FormsModule,
//                 ReactiveFormsModule,
//                 ClarityModule,
//                 SetlComponentsModule,
//             ],
//             providers: [],
//         }).compileComponents();
//         TestBed.resetTestingModule = () => TestBed;
//     })().then(done).catch(done.fail));
//
//     afterAll(() => {
//         TestBed.resetTestingModule = resetTestingModule;
//     });
//
//     beforeEach(() => {
//         fixture = TestBed.createComponent(PrecentralisationReportComponent);
//         comp = fixture.componentInstance;
//         de = fixture.debugElement.query(By.css('clr-tab'));
//         el = de.nativeElement;
//     });
//
//     // describe('structure', () => {
//     //     it('should render a title with the wording: \'Centralisation Report: All Shares\'', () => {
//     //         // const headerEl = fixture.debugElement.query(By.css('div')).nativeElement;
//     //         // expect(headerEl.innerText.trim()).toEqual('Centralisation Report: All Shares');
//     //     });
//     // });
// });
