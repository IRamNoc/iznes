import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {
    MenuOptionListService
} from './menu-option-list.service';

/* Option Interface. */
interface Option {
    id: number;
    icon: string;
    text: string;
    color?: string;
}

@Component({
    selector: 'menu-options-list',
    templateUrl: './menu-option-list.component.html',
    styleUrls: ['./menu-option-list.component.css']
})

export class MenuOptionListComponent {
    /* The option list, needs to follow the interface above. */
    @Input()
    optionsList: Array<Option> = [
        {
            'id': 1,
            'icon': 'fa-check-circle-o',
            'text': 'Allow',
            'color': 'green',
        },
        {
            'id': 0,
            'icon': 'fa-circle-o',
            'text': 'Do Not Allow',
            'color': 'orange',
        }
    ];

    /* The selected event, triggered everytime an option is selected and on init. */
    @Output()
    selected: EventEmitter<Option> = new EventEmitter();

    /* Init value. */
    @Input()
    initData: any;

    @Input()
    metaData: any;

    /* Subscription. */
    private closeSubscription: any;

    /* Ui properties. */
    public uiListOpen: boolean = false;

    constructor(
        private optionListService: MenuOptionListService
    ) {
        /* Subscribe to the close event. */
        this.closeSubscription = optionListService.getCloseEmitter().subscribe((data) => {
            /* If data and we're open... */
            if (data === 1 && this.uiListOpen === true) {
                /* ...toggle this state. */
                this.toggleOpen();
            }
        });
    }

    get optionSelect() {
        let value = 1;
        if (this.initData) {
            value = this.initData;
        }

        return this.optionsList.find(el => el.id == value);
    }

    /**
     * Handle Selection
     * ----------------
     * Handles to selection of a new option, changing the property in this class
     * and emitting the new data.
     *
     * @param  {Option} option [description]
     *
     * @return {[type]}        [description]
     */
    public handleSelection(option: Option) {
        /* Emit. */
        this.selected.emit(option);

        /* Toggle the state. */
        this.toggleOpen();
    }

    /**
     * Toggle Open
     * ------------
     * Toggles the open state.
     *
     * @return {void}
     */
    public toggleOpen() {
        /* If we're not open, ask others to close before we open. */
        if (!this.uiListOpen) this.optionListService.emitClose();

        /* Close all lists. */
        this.uiListOpen = this.uiListOpen ? false : true

        /* Return. */
        return;
    }

}
