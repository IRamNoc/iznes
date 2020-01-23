import {ToasterService, Toast} from 'angular2-toaster';
import {Injectable} from '@angular/core';

@Injectable()
export class ToasterServiceMock extends ToasterService {
    pop(type: string | Toast, title?: string, body?: string): any {
    }
}
