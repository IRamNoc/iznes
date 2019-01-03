import {Component, Input} from '@angular/core';

@Component({
    selector: 'json-viewer',
    template: `
        <ngx-json-viewer [json]="json"></ngx-json-viewer> 
    `,
})
export class JsonViewer {
    @Input('json')
    json: any;
}
