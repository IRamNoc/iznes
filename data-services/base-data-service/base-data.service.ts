import { Observable } from 'rxjs/Rx';

interface DataSet {
    [dataId: string]: {
        data$: Observable<any>;
        requested$: Observable<boolean>;
        requestMethod: string;
    };
}

export class BaseDataService<Service> {

    dataSet: DataSet = {};

    constructor(
        protected dataService: Service,
    ) {
    }

    setupData(dataId: string, requestMethod: string, data$: Observable<any>, requested$: Observable<boolean>) {
        this.dataSet[dataId] = {
            data$,
            requested$,
            requestMethod,
        };
    }

    requestData(dataId: string, requestedState: boolean, ...args) {
        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Request the list.
            this.dataService[this.dataSet[dataId].requestMethod](...args);
        }
    }

    /**
     * Subscribe to the redux data, and return the observable.
     */
    getData<Data>(dataId: string, ...args): Observable<Data> {
        if (!this.dataSet[dataId]) {
            throw new Error('Seem like you forgot to call "setupData()"');
        }

        // subscribe to requested flag on the data.
        this.dataSet[dataId].requested$.subscribe((requested) => {
            this.requestData(dataId, requested, ...args);
        });

        return this.dataSet[dataId].data$;
    }
}
