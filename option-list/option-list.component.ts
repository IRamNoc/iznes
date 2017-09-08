import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {
    OptionListService
} from './option-list.service';

/* Option Interface. */
interface Option {
    id: number;
    icon: string;
    text: string;
    color?: string;
}

@Component({
  selector: 'options-list',
  templateUrl: './option-list.component.html',
  styleUrls: ['./option-list.component.css']
})

export class OptionListComponent {
    /* The option list, needs to follow the interface above. */
    @Input()
    optionsList:Array<Option> = [
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
        },
        {
            'id': 2,
            'icon': 'fa-ban',
            'text': 'Forbid',
            'color': 'red',
        }
    ];

    /* The value bound to this option list, defaulted to Do not allow. */
    @Input()
    optionSelect:Option = this.optionsList[1];

    /* The selected event, triggered everytime an option is selected and on init. */
    @Output()
    selected:EventEmitter<Option> = new EventEmitter();

    /* Subscription. */
    private closeSubscription:any;

    /* Ui properties. */
    public uiListOpen:boolean = false;

    constructor (
        private optionListService: OptionListService
    ) {
        /* Subscribe to the close event. */
        this.closeSubscription = optionListService.getCloseEmitter().subscribe((data) => {
            /* If data and we're open... */
            if ( data === 1 && this.uiListOpen === true) {
                /* ...toggle this state. */
                this.toggleOpen();
            }
        })
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
    public handleSelection (option:Option) {
        /* The option selected to the new option. */
        this.optionSelect = option;

        /* Emit. */
        this.selected.emit( this.optionSelect );

        /* Toggle the state. */
        this.toggleOpen();

        /* Return. */
        return;
    }

    /**
     * Toggle Open
     * ------------
     * Toggles the open state.
     *
     * @return {void}
     */
    public toggleOpen () {
        /* If we're not open, ask others to close before we open. */
        if ( ! this.uiListOpen ) this.optionListService.emitClose();

        /* Close all lists. */
        this.uiListOpen = this.uiListOpen ? false : true

        /* Return. */
        return;
    }

}
