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

    requestData(dataId: string, requestedState: boolean) {
        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Request the list.
            this.dataService[this.dataSet[dataId].requestMethod]();
        }
    }

    /**
     * Subscribe to the redux data, and return the observable.
     */
    getData<Data>(dataId: string): Observable<Data> {
        if (!this.dataSet[dataId]) {
            throw new Error('Seem like you forgot to call "setupData()"');
        }

        // subscribe to requested flag on investor invitation.
        this.dataSet[dataId].requested$.subscribe((requested) => {
            this.requestData(dataId, requested);
        });

        return this.dataSet[dataId].data$;
    }
}
