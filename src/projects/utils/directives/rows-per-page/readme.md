# Introduction
Rows Per Page is a directive for use on Clarity Datagrids across Setl projects. The directive adds a select input to
the DOM allowing users to choose the amount of rows to display per datagrid page.

Features:
* A default of 5 RowsPerPage with preset values of `5, 10, 20, 50 and 100` to select between
* Pass in a custom array of numbers to the `[defaultRows]` input to override the above presets
* Saves the users RowsPerPage preference to MySQL on each change and restores this setting
* If no saved user setting exists, you can pass a custom default value in the RowsPerPage HTML attribute which gets added to the select input if not already present
* A CSS fix is applied to remove the static height of the datagrid if 20 RowsPerPage or greater is selected

# Usage:
## 1. Import the `SetlDirectivesModule`

Import the `SetlDirectivesModule` into your module by using an import statement and adding it to the imports array

```typescript
import { SetlDirectivesModule } from '@setl/utils/directives/index';

@NgModule({
    imports: [
        SetlDirectivesModule,
    ]
})
```

## 2. Using the `RowsPerPageDirective`.

Set up a variable in your `component.ts` to store the emitted value to pass to the datagrid

```typescript
    public pageSize: Number;
```

## 3. Using the `rowsPerPage` directive.

**Note: you'll have to import the `SetlDirectivesModule` into the module that your component is declared in.**

An example of a HTML datagrid footer in a component using the directive.

```html
<clr-dg-footer>
    <div rowsPerPage="10" [defaultRows]="[5, 10, 15, 20]" (rowsUpdate)="pageSize = $event"></div>
    {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}}
    <clr-dg-pagination #pagination [clrDgPageSize]="pageSize"></clr-dg-pagination>
</clr-dg-footer>
```

* `rowsPerPage="10"` is passing a default of 10 RowsPerPage (Note: this will be overwritten if a saved user preference exists). Equally you can omit the value and just use
`rowsPerPage` which will set the default to 5
* `[defaultRows]` is the optional input to pass a custom array of numbers to replace the select options with 
* `(rowsUpdate)="pageSize = $event"` updates the variable defined on the `component.ts` with the RowsPerPage
value as it is changed
* `[clrDgPageSize]="pageSize"` is passing the RowsPerPage value to the datagrid
