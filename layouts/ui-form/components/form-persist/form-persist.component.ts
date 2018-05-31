/* Core imports. */
import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

/* Import the service definition. */
import {PersistService} from "@setl/core-persist";

import {MultilingualService} from '@setl/multilingual';

/* Decorator. */
@Component({
    selector: 'app-ui-layouts-form-persist',
    templateUrl: './form-persist.component.html',
    styles: [`
        .padding {
            padding: 0 20px 20px;
        }

        .toggle-info-panes {
            display: block;
            padding-bottom: 10px;
            text-decoration: none;

        &
        :before,

        &
        :after {
            text-decoration: none;
        }

        }`
    ]
})
/* Class */
export class UiFormPersistComponent {
    /* Public properties. */
    public showInfoPanes: boolean = true;
    public longForm: FormGroup;
    public mockSelectItems = [{
        id: '0',
        text: 'Select Item 1'
    }, {
        id: '1',
        text: 'Select Item 2'
    }, {
        id: '2',
        text: 'Select Item 3'
    }];

    /*
        This private property is used every time we call a persist method, it
        tells the service what form we're talking about.

        This ID must be added to the tblPersistForms table.
     */
    private _persist_exampleFormId = 'uiLayouts/exampleForm';

    constructor (
        /* Scope the PersistService as a private property. */
        private _persistService: PersistService,
        public _translate: MultilingualService,
    ) {
        /*
            So to enable the form persist on a form you simple create a normal
            FormGroup as you would, but you pass is into the watchForm function
            on the PersistService.

            Next you assign it to the property that the form in the HTML binds
            it's FormGroup property to.
        */
        const watchedFormGroup = this._persistService.watchForm(this._persist_exampleFormId, this.newLongFormGroup());

        /* Set the longForm property. */
        this.longForm = watchedFormGroup;
    }

    /**
     * Clear longForm
     * --------------
     * Resets the longForm's FormGroup and sets the persisted state to an empty
     * one too.
     *
     * @return {void}
     */
    public clearLongForm (): void {
        /* Instatiate a new FormGroup. */
        const newFormGroup = this.newLongFormGroup();

        /*
            In order to clear the persisted data in the membership database, we
            simply call the refreshState function on the PersistService and pass
            it the new FormGroup.
         */
        this._persistService.refreshState(this._persist_exampleFormId, newFormGroup);

        /*
            Next we want the PersistService to watch the new FormGroup, so we
            call watchForm again and pass it the group. Then we can assign it
            directly to the component property that the form binds to in the
            HTML, essetially clearing the form on the UI.
         */
        this.longForm = this._persistService.watchForm(this._persist_exampleFormId, newFormGroup);

        /* Return. */
        return;
    }

    /**
     * Submit Form
     * -----------
     * Handles the submission of the example form.
     *
     * @return {void}
     */
    submitForm(): void {
        /* Tell the user we submitted. */
        alert('Submit form function here');

        /* Clear the form. */
        this.clearLongForm();
    }

    public toggleInfoPanes(event: Event): void {
        event.preventDefault();

        this.showInfoPanes = !this.showInfoPanes;
    }

    /**
     * New longForm FormGroup
     * ----------------------
     * Instantiates an empty FormGroup for the longForm.
     *
     * @return {FormGroup}
     */
    private newLongFormGroup (): FormGroup {
        return new FormGroup({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            passwordConfirm: new FormControl('', Validators.required),
            input: new FormControl(''),
            inputRequired: new FormControl('', Validators.required),
            inputIcon: new FormControl(''),
            select: new FormControl(0)
        });
    }
}
