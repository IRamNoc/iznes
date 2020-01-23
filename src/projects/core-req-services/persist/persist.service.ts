import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {LoadStateRequestBody, SaveStateRequestBody,} from './persist.service.model';
import {NgRedux} from "@angular-redux/store";

@Injectable()
export class PersistRequestService {

	constructor(private memberSocketService: MemberSocketService, private ngRedux: NgRedux<any>) {
        /* Stub. */
    }

    /**
     * Form State Functions
     * =================
     */
    public saveFormState(formId: string, formData: any, context: string): any {
        /* Setup the message body. */
        const messageBody: SaveStateRequestBody = {
            RequestName: 'persistSave',
            token: this.memberSocketService.token,
            formId: formId,
            formData: formData,
            context: context
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            'ngRedux': this.ngRedux,
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody)
        });
    }

    public loadFormState(formId: string, context: string): any {
        /* Setup the message body. */
        const messageBody: LoadStateRequestBody = {
            RequestName: 'persistLoad',
            token: this.memberSocketService.token,
            formId: formId,
            context: context
        };

        /* Return the new member node saga request. */
        return this.buildRequest({
            'ngRedux': this.ngRedux,
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody)
        });
    }

    public buildRequest(request: any): any {
        /* Check for request pipe. */
        if (!request.taskPipe) {
            return;
        }

        /* Build new promise. */
        return new Promise((resolve, reject) => {
            /* Dispatch. */
            request.ngRedux.dispatch(
                SagaHelper.runAsync(
                    request.successActions || [],
                    request.failActions || [],
                    request.taskPipe,
                    {},
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        reject(error);
                    }
                )
            );
        });
    }
}
