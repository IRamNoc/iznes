import {Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {FileViewerPreviewService} from './service';
import {PreviewModalModel} from './PreviewModal';

@Component({
    selector: 'setl-file-viewer-preview',
    templateUrl: 'component.html',
    styleUrls: ['component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileViewerPreviewComponent implements OnInit {

    model: PreviewModalModel;

    constructor(private service: FileViewerPreviewService,
        private changeDetectorRef: ChangeDetectorRef) {
        this.service.openEmitter.subscribe((model: PreviewModalModel) => {
            this.model = model;

            this.changeDetectorRef.markForCheck();
            this.changeDetectorRef.detectChanges();
        });

        this.service.closeEmitter.subscribe(() => {
            this.model = undefined;

            this.changeDetectorRef.markForCheck();
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnInit() { }
    
    isOpen(): boolean {
        return !!this.model;
    }

    close(): void {
        this.model = undefined;
    }

}