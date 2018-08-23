import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable()
export class OfiFundShareFormService {
    readonly stepsSubject: Subject<StepObject> = new Subject();

    constructor() {}

    subscribeToSteps(callback: (step: StepObject) => void): Subscription {
        return this.stepsSubject.subscribe((step: StepObject) => callback(step));
    }

    publishStep(step: StepObject): void {
        this.stepsSubject.next(step);
    }
}

interface StepObject {
    Step: number;
}
