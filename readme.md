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
        /* Your FormGroup. */
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
/* In angular you should import the service in a module and assign the service to a property on a component. */
const returnedGroup = new PersistService().watchForm(formName, formGroup);
```

#### Parameters

`formName` - a string identifier of the form whose FormGroup is being watched.

`formGroup` - a FormGroup object that is to be watched for changes and recovered on init.

#### Returns

`FormGroup` - the original FormGroup passed in as the second parameter.

## `PersistService.unwatchForm()`

The `unwatchForm` method accepts a form's name, and removes a valueChange subscription if it exists for that form. The subscription is added to the form by calling `watchForm`.

### Syntax

```typescript
/* In angular you should import the service in a module and assign the service to a property on a component. */
const wasWatched = new PersistService().unwatchForm(formName);
```

#### Parameters

`formName` - a string identifier of the form whose FormGroup is being watched.

#### Returns

`true` is returned if a subscription was un-subscribed, `false` if there was not one.

## `PersistService.refreshState()`

The `refreshState` method accepts a form's name, and a new FormGroup object. It sets the value of a saved form state to the FormGroup passed in, so is useful for clearing a form state to an empty one.

### Syntax

```typescript
/* In angular you should import the service in a module and assign the service to a property on a component. */
const formGroup = new PersistService().refeshState(formName, formGroup);
```

#### Parameters

`formName` - a string identifier of the form whose FormGroup is being watched.

`formGroup` - a FormGroup object whose value is to be saved over any previous one.

#### Returns

`FormGroup` - the original FormGroup passed in as the second parameter.
