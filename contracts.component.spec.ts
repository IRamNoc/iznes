import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/lib/testing';
import { MemberSocketService } from '@setl/websocket-service';
import { ClarityModule } from '@clr/angular';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { APP_CONFIG } from '@setl/utils';
import { ContractsComponent } from './contracts.component';

describe('ContractsComponent', () => {

    let component: ContractsComponent;
    let fixture: ComponentFixture<ContractsComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ClarityModule],
            declarations: [ContractsComponent],
            providers: [
                AlertsService,
                { provide: MemberSocketService, useValue: {
                    hostname: '127.0.0.1',
                    port: '9788',
                    path: '/',
                }},
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
            ],
        });

        fixture = TestBed.createComponent(ContractsComponent);
        component = fixture.componentInstance;
    });
});
