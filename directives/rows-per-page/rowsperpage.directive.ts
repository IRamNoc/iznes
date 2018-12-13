/* Angular/vendor imports. */
import { Directive, ElementRef, EventEmitter, Output, OnInit } from '@angular/core';
import { MultilingualService } from '@setl/multilingual';

/* Decorator. */
@Directive({
    selector: '[rowsPerPage]'
})

/* Export directive class. */
export class RowsPerPageDirective implements OnInit {

    private changes: MutationObserver;
    private htmlRendered: boolean = false;
    private defaultRows: any;

    // Output that will emit outside the directive
    @Output() rowsUpdate: EventEmitter<any> = new EventEmitter();

    /* Constructor. */
    constructor(
        private el: ElementRef,
        public translate: MultilingualService,
    ) {
    }

    ngOnInit() {
        // Get default row value or set to 5 if not set
        this.defaultRows = this.el.nativeElement.getAttribute('rowsPerPage') || 5;

        // Emit the default value to set the rows on the datagrid
        this.rowsUpdate.emit(Number(this.defaultRows));

        // Setup the MutationObserver to watch for changes on the datagrid
        this.changes = new MutationObserver(
            (mutations: MutationRecord[]) => {
                mutations.forEach((mutation: MutationRecord) => this.renderChecker());
            },
        );
        this.changes.observe(this.el.nativeElement.closest('clr-datagrid'), {
            attributes: true,
        });

    }

    renderChecker() {
        // Stop running if HTML is already rendered
        if (this.htmlRendered) {
            return;
        }

        // Set array of possible row values
        const rowValues = [5, 10, 20, 50, 100];

        // If default rows isn't in rowValues, add it in and sort numerically
        if (!rowValues.includes(Number(this.defaultRows))) {
            rowValues.push(this.defaultRows);
            rowValues.sort((a, b) => a - b);
        }

        // Build the HTML for rows per page select
        let selectHTML = `
            <div class="page-size">
                ${this.translate.translate('Rows per page')}
                <select id="selectPageSize">
        `;
        rowValues.forEach(addOption);

        function addOption(currentValue) {
            selectHTML += `<option value="${currentValue}">${currentValue}</option>`;
        }

        selectHTML += `
                </select>
            </div>
        `;

        // Count the rows in the datagrid
        const datagrid = this.el.nativeElement.closest('clr-datagrid').outerHTML;
        const rowCount = (datagrid.match(/datagrid-row-master/g) || []).length;

        // If datagrid is more than one page then render the HTML
        if (rowCount >= this.defaultRows) {

            // Push the HTML to the DOM
            this.el.nativeElement.innerHTML = selectHTML;

            // Set flag that HTML has been rendered
            this.htmlRendered = true;

            // Target the select just created
            const select = (this.el.nativeElement.firstElementChild.firstElementChild) as HTMLSelectElement;

            // Set the selected value to the default rows
            select.value = this.defaultRows;

            // Listen for value changes and emit them to change the rows per page
            select.addEventListener('change', function () {
                const value = Number(select.options[select.selectedIndex].value);
                this.rowsUpdate.emit(value);

                // Fix static datagrid height if rows per page is 20 or greater
                document.querySelector('clr-datagrid').classList.remove('dg-height-fix');
                if (value >= 20) {
                    document.querySelector('clr-datagrid').classList.add('dg-height-fix');
                }
            }.bind(this));
        }
    }
}
