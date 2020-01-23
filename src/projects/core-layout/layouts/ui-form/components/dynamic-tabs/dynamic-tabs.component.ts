import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

/*  */
import {immutableHelper} from '@setl/utils';

@Component({
    selector: 'app-ui-layouts-dynamic-tabs',
    templateUrl: './dynamic-tabs.component.html',
    styles: [`
        .padding {
            padding: 0 20px 20px;
        }
        .toggle-info-panes {
            display: block;
            padding-bottom: 10px;
            text-decoration: none;

            &:before, &:after { text-decoration: none; }
        }`
    ]
})
export class UiDynamicTabsComponent {
    /* Public properties. */
    public showInfoPanes: boolean = true;

    /*
        This property is an array of tabs objects.

        Each object has the usual title (icon and text) and the tab ID as well
        as the active flag.
     */
    public tabsControl = [
        {
            'title': {              // Title object.
                'icon': 'fa-bars',  // The font-awesome icon class to use.
                'text': 'Primary'   // The text to be shown on the tab label.
            },
            'id': 0,       // ID, to categorise this tab.
            'active': true // A flag to set this tab to active.
        },
        {
            'title': {
                'icon': 'fa-bars',
                'text': 'Secondary'
            },
            'id': 1,
            'active': false
        }
    ];

    constructor () {
        /* Stub. */
    }

    /**
     * Toggle Panes
     * ------------
     * Toggles the information panes on this component.
     *
     * @return {void}
     */
    toggleInfoPanes(event: Event): void {
        /* Prevent default. */
        event.preventDefault();

        /* Reverse the flag. */
        this.showInfoPanes = !this.showInfoPanes;
    }

    /**
     * Close Tab
     * ---------
     * Removes a tab from the tabs control array, in effect, closing it.
     *
     * @param {index} number - the tab inded to close.
     *
     * @return {void}
     */
    public closeTab(index) {
        /* Validate that we have index. */
        if (!index && index !== 0) {
            return;
        }

        /* Remove the object from the tabsControl. */
        this.tabsControl = [
            ...this.tabsControl.slice(0, index),
            ...this.tabsControl.slice(index + 1, this.tabsControl.length)
        ];

        /* Return */
        return;
    }

    /**
     * Set Tab Active
     * --------------
     * Sets all tabs to inactive other than the given index, this means the
     * view is switched to the wanted tab.
     *
     * @param {index} number - the tab inded to close.
     *
     * @return {void}
     */
    public setTabActive(index: number = 0) {
        /* Set the tabsControl array to a newly mapped, and corrected array. */
        this.tabsControl = immutableHelper.map(this.tabsControl, (item, thisIndex) => {
            return item.set('active', thisIndex === Number(index));
        });
    }


}
