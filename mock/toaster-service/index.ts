import {ToasterService} from 'angular2-toaster';
import {Injectable} from '@angular/core';

@Injectable()
export class ToasterServiceMock extends ToasterService {
    pop() {
    }
}
