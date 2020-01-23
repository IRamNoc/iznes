import { Observable, Subscription } from 'rxjs';

/**
 * Decorator for managing subscription in a component. It will clean up all the subscription on component OnDestroy life
 * cycle.
 * usage:
 * 1. Add  @AppObservableHandle decorator into your component.
 * 2. Implement OnDestroy interface
 * 3. When we want to subscribe to an observable, we do it with the following way.
 *      ```
 *          (<any>this).appSubscribe(observable, callbackFunction);
 *      ```
 *
 * @param constructor
 * @constructor
 */
export function AppObservableHandler(constructor) {
    constructor.prototype.localSubscriptions = [] as Subscription[];

    // create a subscribe method for component to call when create subscription
    constructor.prototype.appSubscribe = function<T>(
        obs: Observable<T>,
        next?: (value: T) => void,
        error?: (error: any) => void,
        complete?: () => void,
    ) {
        this.localSubscriptions.push(obs.subscribe(next, error, complete));
    };

    // handle auto unsubscribe.

    // store the on destroy function to variable. so we can call it below.
    const original = constructor.prototype.ngOnDestroy;

    // override the ngOnDestroy life cycle event.
    constructor.prototype.ngOnDestroy = function () {

        // unsubscribe all the subscriptions that created by calling the subscribe function above.
        for (const sub of this.localSubscriptions) {
            sub.unsubscribe();
        }

        // apply the onDestroy function stored above here.
        original && typeof original === 'function' && original.apply(this, arguments);
    };
}

