# Introduction
Multilingual is an angular 4 SETL module that houses key components for the translation of the openCSD system.

Features:
* A service that can be imported anywhere and used to retrieve translations.
* A module that can be imported into any other module that gives you access to the service and the `mltag` directive.
* Direct access to the translations object.

# Usage:
## 1. Import the `MulitlingualModule`

Import the `MultilingualModule` into your module by using an import statement and adding it to the imports array.

```typescript
import {MultilingualModule} from '@setl/multilingual';

@NgModule({
    imports: [
        MultilingualModule
    ]
})
```

## 2. Using the `MulitlingualService` to retrieve an existing translation.

An example component using the getTranslation method:

```typescript
import {MultilingualService} from '@setl/multilingual';

class MyComponent {
    // Assign the multilingual service to a private property.
    constructor (
        private multilingualService:MultilingualService,
    ) {
        // Now call the method.
        this.multilingualService.getTranslation('txt_home'); // "Home"
    }
}
```

## 3. Using the `MulitlingualService` to create a new translation.

**Note: See the `Translations System` document for guidance on how to enter new translations into the translations database via the translations generator.**
**Note: See the `Translations System` document for guidance on how to use `updateTranslations.sh` to update the `translations.ts` file with new translations.**

Translate a string using the following methods:


### Static string: 

```javascript
{{ Username is required | translate }}
```

### Dynamic string: 

```javascript
{{'Log in to @appConfig.platform@' | translate: {'appConfig.platform': appConfig.platform} }}
```

### MultilingualService translate method:

```html
<input type="text" [placeholder]="multilingualService.translate('Enter your username')">
```

## 4. Using the `mltag` directive.

**Note: Use of the `mltag` directive has been depreciated in favour of the pipe methods (see point #3) above.**

**Note: Please replace instances of `mltag` with the pipe methods (see point #3) as you encounter them in the codebase.**

**Note: You'll have to import the `MultilingualModule` into the module that your component is declared in.**

An example of HTML in a component using the directive.

```html
<div>
    <span id="my-element" mltag="txt_home">Home</span>
</div>
```

The directive is adaptive. So if the translation is found, the element will firstly be checked for attributes, if it doesn't have any that are specified then its tagname will be checked - if all else fails - the innerHTML will be replaced.

As of right now, here are custom behaviours for specific tags;

| Tag Name / Attribute   | Behaviour                                           |
|------------|-----------------------------------------------------|
| `[title]`  | The translation replaces the title content.         |
| `input`    | The translation replaces the placeholder attribute. |
| not above  | The translation replaces the innerHTML.             |
