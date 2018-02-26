import {TextInputListComponent} from './component';
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {DebugElement} from '@angular/core';
import { By } from '@angular/platform-browser';



describe('TextInputListComponent', () => {

    let fixture: ComponentFixture<TextInputListComponent>;
    let comp:    TextInputListComponent;
    let de:      DebugElement;
    let el:      HTMLElement;

    const mockTitle = 'test title';
    const mockAdditionnalText = 'test additionnalText';
    const mockContent = {
        test1: {value: 'value1', label: 'label1'},
        test2: {value: 'value2', label: 'label2'},
        test3: {value: 'value3', label: 'label3'},
        test4: {value: 'value4', label: 'label4'},
        test5: {value: 'value5', label: 'label5'},
    };

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
        comp.content = mockContent;
        comp.additionnalText = mockAdditionnalText;

        fixture.detectChanges();
    });

    describe('structure', () => {
        it('should display a form', () => {
            const inputs = fixture.debugElement.queryAllNodes(By.css('form'));

            expect(inputs.length).toBe(1);
        });
    });

    describe('interface', () => {
        it('should display the @Input title as header', () => {
            const header = fixture.debugElement.query(By.css('h4'));

            expect(header.nativeElement.textContent).toBe(mockTitle);
        });

        it('should display the @Input additionnalText as additionnal text', () => {
            const p = fixture.debugElement.query(By.css('form + p'));

            expect(p.nativeElement.textContent).toBe(mockAdditionnalText);
        });

        it('should display the @Input content as form inputs', () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));
            const labels = fixture.debugElement.queryAll(By.css('label'));
            Object.keys(mockContent).forEach((key, idx) => {
                expect(inputs[idx].nativeElement.value).toBe(mockContent[key].value);
                expect(labels[idx].nativeElement.textContent).toBe(mockContent[key].label);
            });
        });

        it('should display no form when @Input content is an empty object', () => {
            comp.content = {};
            fixture.detectChanges();

            const form = fixture.debugElement.queryAll(By.css('form'));
            const inputs = fixture.debugElement.queryAll(By.css('input'));

            expect(form.length).toBe(0);
            expect(inputs.length).toBe(0);
        });
    });
});
