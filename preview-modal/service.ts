import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {PreviewModalModel} from './PreviewModal';

@Injectable()
export class FileViewerPreviewService {

    openEmitter: Subject<PreviewModalModel> = new Subject();
    closeEmitter: Subject<void> = new Subject();

    constructor() {
    }

    open(model: PreviewModalModel): void {

        this.openEmitter.next(model);
    }

    close(): void {
        this.closeEmitter.next();
    }
}
