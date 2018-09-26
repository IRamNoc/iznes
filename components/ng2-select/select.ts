import {
    Component, Input, Output, EventEmitter, ElementRef, OnInit, forwardRef,
    ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectItem } from './select-item';
import { stripTags } from './select-pipes';
import { OptionsBehavior } from './select-interfaces';
import { escapeRegexp } from './common';
import { MultilingualService } from '@setl/multilingual';
import * as xss from 'xss';
import { find, castArray } from 'lodash';

@Component({
    selector: 'ng-select',
    styleUrls: ['./select.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            /* tslint:disable */
            useExisting: forwardRef(() => SelectComponent),
            /* tslint:enable */
            multi: true,
        },
    ],
    templateUrl: './select.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements OnInit, ControlValueAccessor {

    @Input() public allowClear = false;
    @Input() public placeholder = '';
    @Input() public idField = 'id';
    @Input() public textField = 'text';
    @Input() public childrenField = 'children';
    @Input() public multiple = false;
    @Input() public inlineLabel = '';
    @Input() public inlineLabelMlTag = '';
    @Input() public captureKeys = true;
    @Input() public containerWidth = '360px';

    @Input()
    public set items(value: any[]) {
        if (!value) {
            this.itemsList = this.itemObjects = [];
        } else {
            this.itemsList = value.filter((item: any) => {
                if ((typeof item === 'string') || (typeof item === 'object' && item &&
                    item[this.textField] !== undefined && item[this.idField] !== undefined)) {
                    return item;
                }
            });
            this.itemObjects = this.itemsList.map(
                (item: any) => (typeof item === 'string' ? new SelectItem(item) : new SelectItem({
                    id: item[this.idField],
                    text: item[this.textField],
                    children: item[this.childrenField],
                })),
            );

            // Override placeholder if items over 1,000
            if (this.itemObjects.length >= 1000) {
                this.placeholder = 'Type to search';
            }
        }

        // this.changeDetectorRef.markForCheck();
    }

    @Input()
    public set disabled(value: boolean) {
        this.disabledFlag = value;
        if (this.disabledFlag === true) {
            this.hideOptions();
        }
    }

    public get disabled(): boolean {
        return this.disabledFlag;
    }

    @Input()
    public set active(selectedItems: any) {
        try {
            this.handleNonExistOptions(selectedItems);
            if (!selectedItems || selectedItems.length === 0) {
                this.activeFlag = [];
            } else {
                if (typeof selectedItems === 'string') {
                    selectedItems = selectedItems.split(' ');
                    selectedItems = castArray(selectedItems);
                }
                const areItemsStrings = typeof selectedItems[0] === 'string';

                this.activeFlag = selectedItems.map((item: any) => {
                    const id = areItemsStrings ? item : item.id;
                    const foundObject = find(this.itemObjects, ['id', id]);
                    let data;

                    if (foundObject) {
                        data = foundObject;
                    } else {
                        data = areItemsStrings
                            ? item
                            : { id: item[this.idField], text: item[this.textField] }
                        ;
                    }

                    return new SelectItem(data);
                });
            }
            this.changeDetectorRef.markForCheck();
        } catch (e) {
            this.activeFlag = [];
        }
    }

    @Output() public data: EventEmitter<any> = new EventEmitter();
    @Output() public selected: EventEmitter<any> = new EventEmitter();
    @Output() public removed: EventEmitter<any> = new EventEmitter();
    @Output() public typed: EventEmitter<any> = new EventEmitter();
    @Output() public opened: EventEmitter<any> = new EventEmitter();

    public options: SelectItem[] = [];
    public itemObjects: SelectItem[] = [];
    public activeOption: SelectItem;
    public element: ElementRef;
    public inputMode = false;
    public inputValue = '';

    public get active(): any {
        return this.activeFlag;
    }

    set optionsOpened(value: boolean) {
        this.optionsOpenedFlag = value;
        this.opened.emit(value);
    }

    get optionsOpened(): boolean {
        return this.optionsOpenedFlag;
    }

    protected onChange: any = Function.prototype;
    protected onTouched: any = Function.prototype;

    private optionsOpenedFlag = false;
    private behavior: OptionsBehavior;
    private itemsList: any[] = [];
    private disabledFlag = false;
    private activeFlag: SelectItem[] = [];

    public constructor(element: ElementRef,
                       private changeDetectorRef: ChangeDetectorRef, public translate: MultilingualService) {
        this.element = element;
        this.clickedOutside = this.clickedOutside.bind(this);

    }

    public sanitize(html: string): string {
        return xss(html);
    }

    public inputEvent(e: any, isUpMode: boolean = false): void {
        if (!this.captureKeys) {
            e.preventDefault();
            return;
        }
        // tab
        if (e.keyCode === 9) {
            return;
        }
        if (isUpMode && (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 ||
            e.keyCode === 40 || e.keyCode === 13)) {
            e.preventDefault();
            return;
        }
        // backspace
        if (!isUpMode && e.keyCode === 8) {
            const el: any = this.element.nativeElement
            .querySelector('div.ui-select-container .option-wrapper > .select-search >input');
            if (!el.value || el.value.length <= 0) {
                if (this.active.length > 0) {
                    this.remove(this.active[this.active.length - 1]);
                }
                e.preventDefault();
            }
        }
        // esc
        if (!isUpMode && e.keyCode === 27) {
            this.hideOptions();
            this.element.nativeElement.children[0].focus();
            e.preventDefault();
            return;
        }
        // del
        if (!isUpMode && e.keyCode === 46) {
            if (this.active.length > 0) {
                this.remove(this.active[this.active.length - 1]);
            }
            e.preventDefault();
        }
        // left
        if (!isUpMode && e.keyCode === 37 && this.itemsList.length > 0) {
            this.behavior.first();
            e.preventDefault();
            return;
        }
        // right
        if (!isUpMode && e.keyCode === 39 && this.itemsList.length > 0) {
            this.behavior.last();
            e.preventDefault();
            return;
        }
        // up
        if (!isUpMode && e.keyCode === 38) {
            this.behavior.prev();
            e.preventDefault();
            return;
        }
        // down
        if (!isUpMode && e.keyCode === 40) {
            this.behavior.next();
            e.preventDefault();
            return;
        }
        // enter
        if (!isUpMode && e.keyCode === 13) {
            // if (this.active.indexOf(this.activeOption) === -1) {
            this.selectActiveMatch();
            this.behavior.next();
            // }
            e.preventDefault();
            return;
        }
        const target = e.target || e.srcElement;
        if (target && target.value) {
            this.inputValue = target.value;
            // Only filter results if input is larger than 2 characters or there are less than 1000 items total.
            if (this.inputValue.length >= 2 || this.itemObjects.length < 1000) {
                this.behavior.filter(new RegExp(escapeRegexp(this.inputValue), 'ig'));
                this.doEvent('typed', this.inputValue);
            }
        } else {
            this.open();
        }
    }

    public ngOnInit(): any {
        this.behavior = (this.firstItemHasChildren) ?
            new ChildrenBehavior(this) : new GenericBehavior(this);
    }

    public remove(item: SelectItem): void {
        if (this.disabledFlag === true) {
            return;
        }
        if (this.multiple === true && this.active) {
            const index = this.active.indexOf(item);
            this.active.splice(index, 1);
            this.data.next(this.active);
            this.doEvent('removed', item);
        }
        if (this.multiple === false) {
            this.active = [];
            this.data.next(this.active);
            this.doEvent('removed', item);
        }
    }

    public doEvent(type: string, value: any): void {
        if ((this as any)[type] && value) {
            (this as any)[type].next(value);
        }

        this.onTouched();
        if (type === 'selected' || type === 'removed') {
            this.onChange(this.active);
        }
    }

    public clickedOutside(): void {
        this.hideOptions();
    }

    public get firstItemHasChildren(): boolean {
        return this.itemObjects[0] && this.itemObjects[0].hasChildren();
    }

    public writeValue(val: any): void {
        this.active = val;
        this.data.emit(this.active);
    }

    public registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    protected matchClick(e: any): void {
        if (this.disabledFlag === true) {
            return;
        }
        this.inputMode = !this.inputMode;
        if (this.inputMode === true && ((this.multiple === true && e) || this.multiple === false)) {
            this.focusToInput();
            this.open();
        }
    }

    protected mainClick(event: any): void {
        if (this.inputMode === true || this.disabledFlag === true) {
            return;
        }
        if (event.keyCode === 46) {
            event.preventDefault();
            this.inputEvent(event);
            return;
        }
        if (event.keyCode === 8) {
            event.preventDefault();
            this.inputEvent(event, true);
            return;
        }
        if (event.keyCode === 9 || event.keyCode === 13 ||
            event.keyCode === 27 || (event.keyCode >= 37 && event.keyCode <= 40)) {
            event.preventDefault();
            return;
        }
        this.inputMode = true;
        const value = String
        .fromCharCode(96 <= event.keyCode && event.keyCode <= 105 ? event.keyCode - 48 : event.keyCode)
        .toLowerCase();
        this.focusToInput(value);
        this.open();
        const target = event.target || event.srcElement;
        target.value = value;
        this.inputEvent(event);
    }

    protected selectActive(value: SelectItem): void {
        this.activeOption = value;
    }

    protected isActive(value: SelectItem): boolean {
        return this.activeOption.id === value.id;
    }

    protected removeClick(value: SelectItem, event: any): void {
        event.stopPropagation();
        this.remove(value);
    }

    private focusToInput(value: string = ''): void {
        setTimeout(
            () => {
                const el = this.element.nativeElement.querySelector(
                    'div.ui-select-container .option-wrapper > .select-search > input');
                if (el) {
                    el.focus();
                    el.value = value;
                }
            },
            0,
        );
    }

    private open(): void {
        this.options = this.itemObjects
        .filter((option: SelectItem) => (this.multiple === false ||
            this.multiple === true && !this.active.find((o: SelectItem) => option.text === o.text)));

        if (this.options.length > 0) {
            this.behavior.first();
        }
        this.optionsOpened = true;
        this.changeDetectorRef.markForCheck();

    }

    private hideOptions(): void {
        this.inputMode = false;
        this.optionsOpened = false;
        this.inputValue = '';
        this.changeDetectorRef.markForCheck();
    }

    private selectActiveMatch(): void {
        this.selectMatch(this.activeOption);
    }

    private selectMatch(value: SelectItem, e: Event = void 0): void {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (this.options.length <= 0) {
            return;
        }
        if (this.multiple === true) {
            this.active.push(value);
            this.data.next(this.active);
        }
        if (this.multiple === false) {
            this.active[0] = value;
            this.data.next(this.active[0]);
        }
        this.doEvent('selected', value);
        this.hideOptions();
        if (this.multiple === true) {
            this.focusToInput('');
        } else {
            this.focusToInput(stripTags(value.text));
            this.element.nativeElement.querySelector('.ui-select-container').focus();
        }
    }

    /**
     * handle options that are not within the possible options, if it is not there, add it in.
     *
     * @param {SelectItem[]} selected
     * @return void
     */
    private handleNonExistOptions(selected: SelectItem[]): SelectItem[] {
        try {
            const optionIds = this.itemObjects.reduce(
                (result, item) => {
                    result.push(item.id);
                    return result;
                },
                [],
            );

            this.itemObjects.map((item) => {
                if (optionIds.indexOf(item.id) === -1) {
                    this.itemObjects.push(item);
                }
            });
        } catch (e) {
            return null;
        }
    }

}

export class Behavior {
    public optionsMap: Map<string, number> = new Map<string, number>();

    public actor: SelectComponent;

    public constructor(actor: SelectComponent) {
        this.actor = actor;
    }

    public fillOptionsMap(): void {
        this.optionsMap.clear();
        let startPos = 0;
        this.actor.itemObjects
        .map((item: SelectItem) => {
            startPos = item.fillChildrenHash(this.optionsMap, startPos);
        });
    }

    public ensureHighlightVisible(optionsMap: Map<string, number> = void 0): void {
        const container = this.actor.element.nativeElement.querySelector('.ui-select-choices-content');
        if (!container) {
            return;
        }
        const choices = container.querySelectorAll('.ui-select-choices-row');
        if (choices.length < 1) {
            return;
        }
        const activeIndex = this.getActiveIndex(optionsMap);
        if (activeIndex < 0) {
            return;
        }
        const highlighted: any = choices[activeIndex];
        if (!highlighted) {
            return;
        }
        const posY: number = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
        const height: number = container.offsetHeight;
        if (posY > height) {
            container.scrollTop += posY - height;
        } else if (posY < highlighted.clientHeight) {
            container.scrollTop -= highlighted.clientHeight - posY;
        }
    }

    private getActiveIndex(optionsMap: Map<string, number> = void 0): number {
        let ai = this.actor.options.indexOf(this.actor.activeOption);
        if (ai < 0 && optionsMap !== void 0) {
            ai = optionsMap.get(this.actor.activeOption.id);
        }
        return ai;
    }

}

export class GenericBehavior extends Behavior implements OptionsBehavior {
    public constructor(actor: SelectComponent) {
        super(actor);
    }

    public first(): void {
        this.actor.activeOption = this.actor.options[0];
        super.ensureHighlightVisible();
    }

    public last(): void {
        this.actor.activeOption = this.actor.options[this.actor.options.length - 1];
        super.ensureHighlightVisible();
    }

    public prev(): void {
        const index = this.actor.options.indexOf(this.actor.activeOption);
        this.actor.activeOption = this.actor
            .options[index - 1 < 0 ? this.actor.options.length - 1 : index - 1];
        super.ensureHighlightVisible();
    }

    public next(): void {
        const index = this.actor.options.indexOf(this.actor.activeOption);
        this.actor.activeOption = this.actor
            .options[index + 1 > this.actor.options.length - 1 ? 0 : index + 1];
        super.ensureHighlightVisible();
    }

    public filter(query: RegExp): void {
        const options = this.actor.itemObjects
        .filter((option: SelectItem) => {
            return stripTags(option.text).match(query) &&
                (this.actor.multiple === false ||
                    (this.actor.multiple === true && this.actor.active.map(
                        (item: SelectItem) => item.id).indexOf(option.id) < 0));
        });
        this.actor.options = options;
        if (this.actor.options.length > 0) {
            this.actor.activeOption = this.actor.options[0];
            super.ensureHighlightVisible();
        }
    }
}

export class ChildrenBehavior extends Behavior implements OptionsBehavior {
    public constructor(actor: SelectComponent) {
        super(actor);
    }

    public first(): void {
        this.actor.activeOption = this.actor.options[0].children[0];
        this.fillOptionsMap();
        this.ensureHighlightVisible(this.optionsMap);
    }

    public last(): void {
        this.actor.activeOption =
            this.actor
                .options[this.actor.options.length - 1]
                .children[this.actor.options[this.actor.options.length - 1].children.length - 1];
        this.fillOptionsMap();
        this.ensureHighlightVisible(this.optionsMap);
    }

    public prev(): void {
        const indexParent = this.actor.options
        .findIndex(
            (option: SelectItem) => this.actor.activeOption.parent && this.actor.activeOption.parent.id === option.id);
        const index = this.actor.options[indexParent].children
        .findIndex((option: SelectItem) => this.actor.activeOption && this.actor.activeOption.id === option.id);
        this.actor.activeOption = this.actor.options[indexParent].children[index - 1];
        if (!this.actor.activeOption) {
            if (this.actor.options[indexParent - 1]) {
                this.actor.activeOption = this.actor
                    .options[indexParent - 1]
                    .children[this.actor.options[indexParent - 1].children.length - 1];
            }
        }
        if (!this.actor.activeOption) {
            this.last();
        }
        this.fillOptionsMap();
        this.ensureHighlightVisible(this.optionsMap);
    }

    public next(): void {
        const indexParent = this.actor.options
        .findIndex(
            (option: SelectItem) => this.actor.activeOption.parent && this.actor.activeOption.parent.id === option.id);
        const index = this.actor.options[indexParent].children
        .findIndex((option: SelectItem) => this.actor.activeOption && this.actor.activeOption.id === option.id);
        this.actor.activeOption = this.actor.options[indexParent].children[index + 1];
        if (!this.actor.activeOption) {
            if (this.actor.options[indexParent + 1]) {
                this.actor.activeOption = this.actor.options[indexParent + 1].children[0];
            }
        }
        if (!this.actor.activeOption) {
            this.first();
        }
        this.fillOptionsMap();
        this.ensureHighlightVisible(this.optionsMap);
    }

    public filter(query: RegExp): void {
        const options: SelectItem[] = [];
        const optionsMap: Map<string, number> = new Map<string, number>();
        let startPos = 0;
        for (const si of this.actor.itemObjects) {
            const children: SelectItem[] = si.children.filter((option: SelectItem) => query.test(option.text));
            startPos = si.fillChildrenHash(optionsMap, startPos);
            if (children.length > 0) {
                const newSi = si.getSimilar();
                newSi.children = children;
                options.push(newSi);
            }
        }
        this.actor.options = options;
        if (this.actor.options.length > 0) {
            this.actor.activeOption = this.actor.options[0].children[0];
            super.ensureHighlightVisible(optionsMap);
        }
    }
}
