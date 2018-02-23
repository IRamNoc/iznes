import {TextInputListComponent} from './component';
import {ComponentFixture, TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {DebugElement} from '@angular/core';
import { By } from '@angular/platform-browser';



fdescribe('TextInputListComponent', () => {

    let fixture: ComponentFixture<TextInputListComponent>;
    let comp:    TextInputListComponent;
    let de:      DebugElement;
    let el:      HTMLElement;

    const mockTitle = 'test title';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TextInputListComponent],
            imports: [ReactiveFormsModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextInputListComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement.query(By.css('.text-input-list'));
        el = de.nativeElement;

        comp.title = mockTitle;
        comp.content = {
            test1: {value: 'value1', label: 'label1'},
            test2: {value: 'value2', label: 'label2'},
            test3: {value: 'value3', label: 'label3'},
            test4: {value: 'value4', label: 'label4'},
            test5: {value: 'value5', label: 'label5'},
        };
        comp.additionnalText = 'test additionnalText';

        fixture.detectChanges();
    });

    describe('structure', () => {
        it('should display a form', () => {
            const inputs = fixture.debugElement.queryAllNodes(By.css('form'));

            expect(inputs.length).toBe(1);
        });
    });

    describe('interface', () => {
        it('should display a title', () => {
            const header = fixture.debugElement.query(By.css('h4'));

            expect(header.nativeElement.textContent).toBe(mockTitle);
        });
    });
});
