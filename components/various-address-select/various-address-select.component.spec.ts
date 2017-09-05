import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VariousAddressTypeComponent} from './various-address-type.component';

describe('VariousAddressTypeComponent', () => {
    let component: VariousAddressTypeComponent;
    let fixture: ComponentFixture<VariousAddressTypeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VariousAddressTypeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VariousAddressTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
