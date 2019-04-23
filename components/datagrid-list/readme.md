# Dynamic Datagrid Component
A configurable component for datagrids that can handle displaying, filtering, searching and exporting list data. Having a central component will help achieve a consistency across datagrids, making them easier to maintain and update, as well as helping to remove boilerplate code from local components.


# Usage:
## 1. Import the `DatagridListModule`

Import the `DatagridListModule` into your module by using an import statement and adding it to the imports array

```typescript
import { DatagridListModule } from '@setl/utils/components/datagrid-list/datagrid-list-module';

@NgModule({
    imports: [
        DatagridListModule,
    ]
})
```

## 2. Using the `DatagridListComponent`

Add the component to your template and pass in your data. A basic setup requires a `fieldsModel`, an object with a key for each listData property and `listData` which is a standard datagrid array of objects.

Below is an example minimal setup:

### Template (HTML):
```html
    <datagrid-list
        [fieldsModel]="myFieldsModel"
        [listData]="myListData">
    </datagrid-list>
```

### Component:
```typescript
public myFieldsModel: {} = {
    address: { // The key must exactly match the proprty name within the listData array
        label: 'Address', // This is the column text label
    },
    amount: {
        label: 'Amount',
    },
};

public myListData: {}[] = [
    {
        address: 'Address#1',
        amount: 900,
    },
]
```


## 3. Datagrid List Actions

Use the `DatagridListActionModel` to create list actions to pass into the datagrid. Pass them into the `[listActions]` input on the datagrid. You can then listen for any clicks on action buttons with the `(action)` output:

### Template (HTML)
```html
    <datagrid-list
        [fieldsModel]="myFieldsModel"
        [listData]="myListData"
        [listActions]="listActions"
        (action)="onAction($event)">
    </datagrid-list>
```

### Component
```typescript
import { DatagridListActionModel } from '@setl/utils/components/datagrid-list/models/datagrid-list-action.model';

public listActions: {}[] = [
    new DatagridListActionModel({
        label: 'View', // button label
        class: 'btn btn-orange btn-sm', // button classes
        icon: 'fa fa-search', // icon classes
        onClick: 'viewBreakdown', // Pass in a string which is emitted on action or a callback function
        isVisible: data => data.type == 'active', // optional: a callback which is passed the row data object that returns a boolean which controls wheather the button is dislayed
    }),
];

public onAction(action) {
    /* When an action button is clicked, an object is emitted with 2 properties:
        {
            type: string, // this is the string passed into the onClick property in the listActions
            data: {}, // this is the object of row data that the action button was clicked on
        }
    You can then handle any actions you need to perform... e.g.
    */
   if (action.type === 'viewBreakdown') this.handleViewBreakdown(action.data);
}
```

## 4. List Data Types and Options
Control how each field is displayed on the datagrid by passing in additional options to the `fieldsModel` object:

```typescript
public myFieldsModel: {} = {
    dataKey: { // Key must match the proprty name within the 'listData' array
        label: string, // This is the column label
        type: 'text'|'number'|'label'|'icon', // optional: controls the display type of the field
        options: {
            pipe: { // optional: uses DynamicPipe, so ensure the pipe you want to use is set up on it
                name: string, // name of the pipe to apply
                params: any, // params to pass to the pipe
            },
            rightAlign: boolean, // optional: right align text in the column
            iconMap: { // optional unless 'type' set to icon
                [value: string]: { // key must match the value associated property in the 'listData' array
                    shape: string, // clarity icon shape
                    text: string, // text to appear next to icon
                    class: string, // classes to be applied to the icon
                }
            },
            labelMap: { // optional unless 'type' set to label
                [value: string]: { // key must match the value associated property in the 'listData' array
                    class: string, // classes to apply to the label, e.g. 'label-success'
                    text: string, // text to appear within label
                },
                ...
            };
        },
    },
    ...
};
```

## 5. Lazy Loaded or Server Driven Datagrids
To set the datagrid up to work with server driven data sets, use the below input and outputs:
* `[lazyLoaded]` - boolean which controls switching the *clrDgItems row iterator to the *ngFor iterator
* `[totalItems]` - count of total list data items to build pagination
* `[(currentPage)]` - two-way bound current page of the datagrid
* `(refresh)` - emits the datagrid state when it is refreshed/reloaded

### Template (HTML)
```html
    <datagrid-list
        [fieldsModel]="myFieldsModel"
        [listData]="myListData"
        [lazyLoaded]="true"
        [totalItems]="totalItems"
        [(currentPage)]="currentPage"
        (refresh)="onRefresh($event)">
    </datagrid-list>
```

### Component example...
```typescript
import { ClrDatagridStateInterface } from '@clr/angular';

public totalItems: number;
public currentPage: number;

public onRefresh(dataGridState: ClrDatagridStateInterface) {
    const pageFrom = dataGridState.page.from;
    const pageSize = dataGridState.page.size;

    this.requestData(pageFrom, pageSize);
}
```


## 6. List Filtering and Search Forms
Apply custom filters to the datagrid columns via the `filters` input and create a search form that appears above the datagrid using the `searchForm` input.

Use one of the 4 pre-built filter classes:
* `DataGridStringFilter` - returns any items that include the search term string
* `DataGridNumberFilter` - returns any items that exactly match the search term string (ignoring any commas)
* `DataGridDropdownFilter` - returns any items that match the value in the dropdown filter
* `DataGridDateRangeFilter` - returns any items with a date within the date range selected

Or pass in your own custom filer.

The search form is built using the Dynamic Form component.


### Template (HTML):
```html
    <datagrid-list
        [fieldsModel]="myFieldsModel"
        [listData]="myListData"
        [filters]="myFilters"
        [searchForm]="mySearchForm">
    </datagrid-list>
```

### Component:
```typescript
import { DataGridStringFilter } from '@setl/utils/components/datagrid-list/filters/string.filter';
import { DataGridNumberFilter } from '@setl/utils/components/datagrid-list/filters/number.filter';
import { DataGridDropdownFilter } from '@setl/utils/components/datagrid-list/filters/dropdown.filter';
import { DataGridDateRangeFilter } from '@setl/utils/components/datagrid-list/filters/daterange.filter';

public myFilters: {} = { // each key must match a property in the the 'listData' array
    stringFieldName: new DataGridStringFilter('stringFieldName'), // pass the field name
    numberFieldName: new DataGridNumberFilter('numberFieldName'), // pass the field name
    dropdownFieldName: new DataGridDropdownFilter('dropdownFieldName'), // pass the field name
    dateRangeFieldName: new DataGridDateRangeFilter({
        dateField: 'dateFieldName', // name of the date field
        fromField: 'fromSearchFormFieldName', // optional: defaulted to dateField + '_from' inline with dynamic form daterange setup
        toField: 'toSearchFormFieldName', // optional: defaulted to dateField + '_to' inline with dynamic form daterange setup
    }),
};

export const searchForm = {
    stringFieldName: {
        label: 'String Field',
        type: FormItemType.text,
        required: false,
    },
    numberFieldName: {
        label: 'Number Field',
        type: FormItemType.number,
        required: false,
    },
    dropdownFieldName: {
        label: 'Dropdown Field',
        type: FormItemType.list,
        listItems: [{ id: 'searchValue', text: 'dropdownText' }, ... ],
        required: false,
    },
    numberFieldName: {
        label: 'Date Field',
        type: FormItemType.dateRange,
        dateOptions: {
            format: 'Y-MM-DD',
        },
        required: false,
    },
};
```

## 7. Exporting to CSV and PDF
Use the `exportOptions` input to set up exporting the current filtered view of the datagrid to CSV or PDF.

### Template (HTML):
```html
    <datagrid-list
        [fieldsModel]="myFieldsModel"
        [listData]="myListData"
        [exportOptions]="exportOptions">
    </datagrid-list>
```

### Component:
```typescript
export const exportOptions: {} = {
    csv: boolean; // controls showing export btn
    csvFileName: string; // optional: must end in '.csv'
    pdf: boolean; // controls showing export btn
    pdfFileName: string; // optional: must end in '.pdf'
    pdfOptions: { // optional
        file: string; // template file name (excluding .html) - lives in /classes/pdf/templates in MemberNode
        title: string; // optional
        subtitle: string; // optional
        text: string; // optional
        rightAlign: string[]; // optional: array of listData property names to right align on PDF datagrid
        walletName: string; // optional
        date: string; // optional
        orientation: 'portrait'|'landscape'; // optional
        border: { // optional
            top: string; // default is 0, units: mm, cm, in, px (e.g. '20mm')
            right: string;
            bottom: string;
            left: string;
        },
        footer: { // optional
            height: string; // default is 0, units: mm, cm, in, px (e.g. '20mm')
            contents: string; // html to add to the footer - use {{page}} of {{pages}} to print out page numbering
        };
    };
};
```

# Index of Inputs and Outputs on `DatagridListComponent`
Here are all possible inputs to the `DatagridListComponent`

```html
    <datagrid-list
        // INPUTS
        [fieldsModel]="fieldsModel" // fields model object
        [listData]="listData" // array of object holding list data
        [listActions]="listActions" // optional: array holding list actions
        [filters]="filters" // optional: object of filter to apply
        [searchForm]="searchForm" // optional: search form set up
        [currentPage]="currentPage" // optional: current page to load the datagrid at
        [totalItems]="totalItems" // optional: total items to build pagination if data is lazy loaded
        [lazyLoaded]="lazyLoaded" // optional: boolean to control using correct row iterator
        [showHideColumns]="showHideColumns" // optional: boolean to control showing the show/hide cols in the footer
        [exportOptions]="exportOptions" // optional: object of CSV and PDF export options

        // OUTPUTS
        (action)="action($event)" // emits the clicked action and the associate rows data Object
        (refresh)="refresh($event)" // emits the datagrid state everytime it is reloaded/refreshed
        (currentPageChange)="currentPageChange($event)" // emits the currently viewed page
        (rowsUpdate)="rowsUpdate($event)" // emits the user selected rows per page
    ></datagrid-list>
```