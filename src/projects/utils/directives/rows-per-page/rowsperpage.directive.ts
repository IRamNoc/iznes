/* Angular/vendor imports. */
import { Directive, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { MultilingualService } from '@setl/multilingual';
import { UserPreferenceService } from '@setl/core-req-services/user-preference/service';
import * as _ from 'lodash';

@Directive({
    selector: '[rowsPerPage]',
    providers: [UserPreferenceService],
})

export class RowsPerPageDirective {

    private htmlRendered: boolean = false;
    private defaultRows: any;

    @Input() rowValues: number[] = [5, 10, 20, 50, 100];
    @Output() rowsUpdate: EventEmitter<any> = new EventEmitter();

    constructor(
        private el: ElementRef,
        private translate: MultilingualService,
        private userPreferenceService: UserPreferenceService,
    ) {
        this.requestUsersRowsPerPage();
    }

    /**
     * Requests the Users Stored RowsPerPage
     * ------------------------------------
     * If no saved user preference exists, then falls back to the value in the rowsPerPage HTML attribute or 5 if
     * that's undefined
     */
    requestUsersRowsPerPage() {
        this.userPreferenceService.getUserPreference({ key: 'rowsperpage' })
            .then((response) => {
                const userStoredRows = _.get(response, '[1].Data[0].value', false);
                this.defaultRows = userStoredRows ? userStoredRows :
                    this.el.nativeElement.getAttribute('rowsPerPage') || 5;
                this.el.nativeElement.setAttribute('rowsperpage', this.defaultRows);
                this.rowsUpdate.emit(Number(this.defaultRows));
                this.renderSelect();
            });
    }

    /**
     * Handles the HTML Rendering
     * --------------------------
     */
    renderSelect() {
        if (this.htmlRendered) {
            return;
        }

        if (!this.rowValues.includes(Number(this.defaultRows))) {
            this.rowValues.push(this.defaultRows);
            this.rowValues.sort((a, b) => a - b);
        }

        this.el.nativeElement.innerHTML = this.buildSelectHTML();
        this.htmlRendered = true;

        this.setupEventListener();
    }

    /**
     * Builds the Select HTML
     * ----------------------
     * @return {string} selectHTML
     */
    buildSelectHTML() {
        const datagrid = this.el.nativeElement.closest('clr-datagrid').outerHTML;
        let borderClass = '';
        if ((datagrid.match(/clr-dg-column-toggle/g) || []).length) {
            borderClass = 'separator';
        }
        let selectHTML = `
            <div class="page-size ${borderClass}">
                ${this.translate.translate('Rows per page')}
                <select id="selectPageSize">`;

        this.rowValues.forEach((value) => {
            selectHTML += `<option value="${value}">${value}</option>`;
        });

        selectHTML += `
                </select>
            </div>`;

        return selectHTML;
    }

    /**
     * Sets Up the Event Listener on the RowsPerPage Select
     * ----------------------------------------------------
     */
    setupEventListener() {
        const select = (this.el.nativeElement.firstElementChild.firstElementChild) as HTMLSelectElement;
        select.value = this.defaultRows;

        select.addEventListener('change', () => this.handleSelectChange(select));
    }

    /**
     * Handles Select Input Change
     * ---------------------------
     * @param select
     */
    handleSelectChange(select: HTMLSelectElement) {
        const value = Number(select.options[select.selectedIndex].value);
        this.rowsUpdate.emit(value);
        this.userPreferenceService.saveUserPreference({ key: 'rowsperpage', value });
        this.el.nativeElement.setAttribute('rowsperpage', value);

        // Fix static datagrid height if rows per page is 20 or greater
        document.querySelector('clr-datagrid').classList.remove('dg-height-fix');
        if (value >= 20) {
            document.querySelector('clr-datagrid').classList.add('dg-height-fix');
        }
    }
}
