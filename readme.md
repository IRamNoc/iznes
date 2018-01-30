# Introduction
Core Persist is a module that contains the form state saving tool.

# Getting started
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

## `PersistService.watchForm()`

The `watchForm` method accepts a form's name and a FormGroup object that it subscribes for changes to. Once changes are triggered, it saves the changes and on initialisation it checks if there is a form state to recover.

### Syntax

```typescript
const returnedGroup = new PersistService().watchForm(formName, formGroup);
```

#### Parameters

`formName` - a string identifier of the form whose FormGroup is being watched.

`formGroup` - a FormGroup object that is to be watched for changes and recovered on init.

#### Returns

`FormGroup` - the original FormGroup passed in as the second parameter.
