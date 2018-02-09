# Introduction
Core Persist is a module that contains a form state saving and recovering tool.

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

You can now import and define the service as a property on your component, and access the methods on the service.

```typescript
/* Import the service definition. */
import {PersistService} from "@setl/core-persist";

/* Your class. */
export class MyComponent {
    /* Properties. */
    public myForm: FormGroup;

    /* Constructor. */
    constructor (
        private persistService: PersistService
    ) {
        /* Stub */
    }
}
```

# Methods

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

#### Example

```typescript
    /* Firstly, let's create a FormGroup. */
    const group = new FormGroup({
        "example": new FormControl(""),
    });

    /*
      Now as usual, we'll assign the group to a property on the class, this way,
      we can bind it to a form in the HTML easily.

      The only difference here is that we're also passing it into the persist
      watchForm function, which will return the FormGroup object.
    */
   this.myFormGroup = this._persistService.watchForm(
       'module/formName',
       group
   );
```

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

#### Example

```typescript
    /*
      In this example, we simply need the formName, and to call the function, it
      will make it so that the state of the form will no longer save to the server.

      The return value will be true if the form was being monitored for input,
      false if it wasn't being monitored.
    */
   const wasWatched = this._persistService.unwatchForm('module/formName');
```

## `PersistService.refreshState()`

The `refreshState` method accepts a form's name, and a new FormGroup object. It sets the value of a saved form state to the FormGroup passed in, so is useful for clearing a form state to an empty one.

### Syntax

```typescript
/* In angular you should import the service in a module and assign the service to a property on a component. */
const formGroup = new PersistService().refreshState(formName, formGroup);
```

#### Parameters

`formName` - a string identifier of the form whose FormGroup is being watched.

`formGroup` - a FormGroup object whose value is to be saved over any previous one.

#### Returns

`FormGroup` - the original FormGroup passed in as the second parameter.

#### Example

```typescript
    /*
      As the refresh state function simply overrides the current saved state of
      the form, it can be used to manipulate the saved state or simply clear it
      to a default and empty FormGroup.
    */
    const group = new FormGroup({
        "example": new FormControl(""),
    });

    /*
      In this case, we're setting the saved state to an empty FormGroup so we've
      effectively cleared it. Just like the watchForm method, refreshState also
      returns the FormGroup, allowing you to set the property on your class
      directly.
    */
   this.myFormGroup = this._persistService.refreshState(
       'module/formName',
       group
   );
```
