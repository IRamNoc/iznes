# Introduction
Core Persist is a module that contains the form state saving tool.

Architecture:
* A module that declares the directive and provides the service to allow easy importing into other modules.
* The self contained service deals with storing the form data and recovering it.
* A directive that initialises and registers with the service, automatically recovering the form state.

# Usage:
## 1. Import the `Persist Module`.

Import the `Persist Module` into your module. The component that contains the form that you wish to use the directive with must be declared in that module.

```typescript
import {PersistModule} from "@setl/core-persist";

@NgModule({
    imports: [
        PersistModule
    ]
})
```

## 2. Using the `PersistDirective`.

Now we can use the directive on a form.

```html
<form persist="user-details">
    <input name="example-input" />
</form>
```
