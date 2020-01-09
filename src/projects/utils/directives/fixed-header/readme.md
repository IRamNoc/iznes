# Introduction
FixedHeader is a directive for use on Clarity Datagrids across SETL projects. The directive fixes the position of the
datagrid header on scroll when it hits the top of the page.

# Usage:
## 1. Import the `SetlDirectivesModule`

Import the `SetlDirectivesModule` into your component module by using an import statement and adding it to the imports array

```typescript
import { SetlDirectivesModule } from '@setl/utils/directives/index';

@NgModule({
    imports: [
        SetlDirectivesModule,
    ]
})
```

## 2. Add the `fixedHeader` directive selector

Add in the `fixedHeader` directive selector to your `<clr-datagrid>` tag

```html
    <clr-datagrid fixedHeader>
```