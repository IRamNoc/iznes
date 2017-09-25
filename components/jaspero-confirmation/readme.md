## Where is come from:
This is an angular 2 component that originally from 
[@jaspero/ng2-confirmation](https://github.com/Jaspero/ng2-confirmations).

## What we got in the customisation
* Allow html in title and message.

## How to use:
#### Import the module to your
```typescript

@NgModule({
    imports: [
        SetlComponentsModule
    ]
})
```

#### Inject Confirmation service
```typescript
import {ConfirmationService} from '@setl/utils';

@Component({
    selector: 'example'
})
export class ExampleConmponet{
    constructor(
       private _confirmationService: ConfirmationService 
    ){}
    
    showConfirmation(){
           this._confirmationService.create(
              '<span>Do something?</span>',
               '<span>You should really just do it</span>'
           ).subscribe((ans) => {
               console.log(ans)
           })
    }
}
```
