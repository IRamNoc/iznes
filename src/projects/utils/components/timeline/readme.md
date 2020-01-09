# Introduction
Timeline is a simple component to display a progress bar of statuses on the UI.

Features:
* Pass in an ordered array of all possible statuses and the current status to build the timeline
* The timeline will animate to reveal the current active status, also marking all previous complete
statuses as active 

# Usage:
## 1. Import the `TimelineModule`

Import the `TimelineModule` into your module by using an import statement and adding it to the imports array

```typescript
import { TimelineModule } from '@setl/utils/components/timeline/module';

@NgModule({
    imports: [
        TimelineModule,
    ]
})
```

## 2. Set up the `[statusList]`

Set up your `[statusList]` as an array of objects, where the object key is the status name and the value the
description. Make sure the array is sorted in the order you want the statuses to display. 

```typescript
    public statusList: {}[] = [
        { Booking: 'Order successfully placed' },
        { Dispatched: 'Your order has been displayed'},
        { Delivery: 'Your order is out for delivery'},
        { Complete: 'Your order is complete'},
    ];
```


## 3. Pass in the `[currentStatus]`

Pass in the current status as a string that matches the object key:

```typescript
    public currentStatus: string = 'Delivery';
```


## 4. Add to your HTML

```html
<timeline [statusList]="statusList" [currentStatus]="currentStatus"></timeline>
```
