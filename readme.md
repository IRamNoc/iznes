# Introduction
Core Persist is a module that contains the form state saving tool.

Parts:
* A UI Component that is used to trigger a save or recover.
* A module that contains all parts of the system, used to import the UI comoonent and the directive for use on forms.
* A service in the persis module, that stores all the form data on the membership DB.

# Usage:
## 1. Import the `Persist Module` and render the Controls.

Import the `Persist Module` into a component that is always rendered while forms are rendered, and then insert the Persist Controls into the component.

```typescript
import {PersistModule} from "@setl/core-persist";

@NgModule({
    imports: [
        PersistModule
    ]
})
```

```html
<setl-persist></setl-persist>
```

## 2. Using the `PersistDirective`.

First, import the `PersistModule` into the module that your form component is declared. 

```typescript
import {PersistModule} from "@setl/core-persist";

@NgModule({
    imports: [
        PersistModule
    ]
})
```

Now we can use the directive on a form.

```html
<form persist="Update Account">
    <input name="example-input" />
</form>
```
