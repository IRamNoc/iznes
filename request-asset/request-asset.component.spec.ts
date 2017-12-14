// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/http';

// import { ClarityModule } from 'clarity-angular';
// import { SelectModule } from '@setl/utils';
// import { ToasterModule, ToasterService } from 'angular2-toaster';

// import { NgRedux, select } from '@angular-redux/store';
// import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
// import {
//     WalletNodeRequestService,
//     WalletnodeTxService,
//     InitialisationService,
//     MyWalletsService
// } from '@setl/core-req-services';
// import { WalletNodeSocketService } from '@setl/websocket-service';
// import { AlertsService } from '@setl/jaspero-ng2-alerts';
// import { MemberSocketService } from '@setl/websocket-service';

// import { RequestAssetComponent } from './request-asset.component';
// import { RequestTypeSelectComponent } from './request-type-select/request-type-select.component';
// import { Observable } from 'rxjs/Observable';

// describe('RequestAssetComponent', () => {
//     let component: RequestAssetComponent;
//     let fixture: ComponentFixture<RequestAssetComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 BrowserModule,
//                 BrowserAnimationsModule,
//                 ClarityModule.forRoot(),
//                 CommonModule,
//                 FormsModule,
//                 NgReduxTestingModule,
//                 SelectModule,
//                 ReactiveFormsModule,
//                 ToasterModule
//             ],
//             providers: [
//                 AlertsService,
//                 InitialisationService,
//                 MyWalletsService,
//                 ToasterService,
//                 WalletNodeRequestService,
//                 WalletnodeTxService,
//                 WalletNodeSocketService,
//                 MemberSocketService
//             ],
//             declarations: [RequestAssetComponent, RequestTypeSelectComponent]
//         })
//         .compileComponents();
//     }));

//     beforeEach(() => {
//         MockNgRedux.reset();
//         fixture = TestBed.createComponent(RequestAssetComponent);
//         component = fixture.componentInstance
//         fixture.detectChanges();
//     });

//     it('should be created', () => {
//         expect(component).toBeTruthy();
//     });
// });
