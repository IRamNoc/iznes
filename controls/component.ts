/* Core imports. */
import {
    Component,
    ChangeDetectorRef,
    AfterViewInit,
    OnDestroy,
    ChangeDetectionStrategy
} from '@angular/core';
import {FormsModule, FormGroup, FormControl, NgModel} from '@angular/forms';
import {ToasterService, ToasterContainerComponent} from 'angular2-toaster';

/* Redux. */
import {select, NgRedux} from '@angular-redux/store';

/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ConfirmationService} from '@setl/utils';

/* Decorator. */
@Component({
    selector: 'setl-persist',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
    providers: [ToasterService],
    changeDetection: ChangeDetectionStrategy.OnPush
})

/* Class. */
export class PersistControlsComponent implements AfterViewInit, OnDestroy {
    /* Subscriptions. */
    private subscriptions = {};

    /* Constructor. */
    constructor(private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private _confirmationService: ConfirmationService,
                private _ngRedux: NgRedux<any>,
    ) {

    }

    ngAfterViewInit(): void {
        /* Override the changes. */
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Show Error Message
     * ------------------
     * Shows an error popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    showError(message) {
        /* Show the error. */
        this.alertsService.create('error', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-danger">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    /**
     * Show Warning Message
     * ------------------
     * Shows a warning popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    showWarning(message) {
        /* Show the error. */
        this.alertsService.create('warning', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-warning">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    /**
     * Show Success Message
     * ------------------
     * Shows an success popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    showSuccess(message) {
        /* Show the message. */
        this.alertsService.create('success', `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-success">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsunscribe all Observables. */
        let key;
        for (key in this.subscriptions) {
            if (this.subscriptions[key].unsubscribe) {
                this.subscriptions[key].unsubscribe();
            }
        }
    }
}
