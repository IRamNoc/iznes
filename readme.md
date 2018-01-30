# Introduction
Core Persist is a module that contains the form state saving tool.

# Usage:
## 1. Import the `Persist Module`.

Import the `Persist Module` into the module your component is declared in. 

```typescript
import {PersistModule} from "@setl/core-persist";

@NgModule({
    imports: [
        PersistModule
    ]
})
```

## 2. Using the `PersistService`.

You can now import and define the service as a property on your component, then use the watchForm function to tell persist to do it's work.

```typescript
/* Import the service definition. */
import {PersistService} from "@setl/core-persist";

/* Your class. */
export class MyComponent {
    /* Properties. */
    public myForm: FormGroup;
    
    /* Constructor. */
    constructor (private persistService: PersistService) {
        /* Your formgroup. */
        const group = new FormGroup({
            "example": new FormControl(""),
        });
        
        /* Attaching the persist to the group,
           simple pass your group into the watchForm,
           and it'll be returned. */
        this.myForm = this.persistService.watchForm('myForm', group);
    }
}
```

# Functions

## `watchForm`

Params:
* `name`  - The form's unique name.
* `group` - The FormGroup that is to be watched and recovered.

This function returns the FormGroup passed to it.

In addition, this function handles being called with the same name, so it's possible to recall it when instantiating a new FormGroup to visually clear the form.
