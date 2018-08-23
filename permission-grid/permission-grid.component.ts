import {
    Component,
    Input,
    Output,
    OnInit,
    AfterViewInit,
    EventEmitter,
} from '@angular/core';

/* Option Interface. */
interface Option {
    id: number;
    icon: string;
    text: string;
    color?: string;
}

@Component({
    selector: 'setl-permission-grid',
    templateUrl: './permission-grid.component.html',
    styleUrls: ['./permission-grid.component.css'],
})
export class PermissionGridComponent implements OnInit, AfterViewInit {

    /* Permission areas, each row. */
    @Input()
    public permissionAreas: any[] = [];

    /* Permission level, each column. */
    @Input()
    public permissionLevels: any[] = [];

    /* Init Data, the data to show. */
    @Input()
    public initData: any;

    /* The option list, needs to follow the interface above. */
    @Input()
    optionsList: Option[] = [
        {
            id: 1,
            icon: 'fa-check-circle-o',
            text: 'Allow',
            color: 'green',
        },
        {
            id: 0,
            icon: 'fa-circle-o',
            text: 'Do Not Allow',
            color: 'orange',
        },
        {
            id: 2,
            icon: 'fa-ban',
            text: 'Forbid',
            color: 'red',
        },
    ];

    /* Update event, the output of the data. */
    @Output()
    public updateEvent: EventEmitter<any> = new EventEmitter();

    /* Raw Data Store. */
    public rawComponentData: any = {};

    public optionOpen: {} = {};

    constructor() {
        /* Stub. */
    }

    ngOnInit() {
        /* Create the new data structure, this will be the two way bound data to
           the grid. */
        let i;
        let j;
        /* Firstly loop each area and make an object to represent it. */
        for (i = 0; i < this.permissionAreas.length; i += 1) {
            /* This is set with a key of the area's ID. */
            this.rawComponentData[this.permissionAreas[i].id] = {};

            /* Then lets loop over each permission level and set a key with
               their ID in this new area object. */
            for (j = 0; j < this.permissionLevels.length; j += 1) {
                /* Equal it to zero by default. */
                this.rawComponentData[this.permissionAreas[i].id][this.permissionLevels[j].id] = '0';
            }
            /* Done! */
        }
        /* Subscribe to the initData event. */
        if (this.initData) {
            this.initData.subscribe((data) => {
                /* Check if we have data. */
                if (!data) {
                    console.warn('Permission Grid: Emitted data to initData, but it was undefined.');
                    return;
                }

                /* Loop over the object and set this raw data to it, then emit data again. */
                let i;
                let j;
                /* Firstly loop each permission area. */
                for (i = 0; i < this.permissionAreas.length; i += 1) {
                    /* Then each permission level. */
                    for (j = 0; j < this.permissionLevels.length; j += 1) {
                        /* Now let's check if the permission area is in the new data. */
                        if (data[this.permissionAreas[i].id]) {
                            /* Now let's check if the permission level is in the permission area in the new data. */
                            if (data[this.permissionAreas[i].id][this.permissionLevels[j].id]) {
                                /* Set the raw data and trigger event update. */
                                this.rawComponentData[this.permissionAreas[i].id][this.permissionLevels[j].id] =
                                    data[this.permissionAreas[i].id][this.permissionLevels[j].id];
                            }
                        }
                    }
                    /* Done! */
                }

                /* Emit. */
                this.triggerDataEmit();
            });
        }
    }

    ngAfterViewInit() {

    }

    /**
     * Update Value
     * ------------
     * Updates a permission value, then triggers an update event.
     *
     * @param  {permissionId} string - the permissionId that relates to this value.
     * @param  {levelId} string - the levelId that relates to this value.
     * @param  {newValue} string - the new value it should be.
     *
     * @return {void}
     */
    public updateValue(permissionId, levelId, newValue) {

        /* Update the value... */
        this.rawComponentData[permissionId][levelId] = newValue;

        /* ...then emit... */
        this.triggerDataEmit();

        /* ...and return.*/
        return;
    }

    /**
     * Trigger Data Emit
     * -----------------
     * Processes the raw data bindings and emits a data structure to anything
     * listening.
     *
     * @return {void}
     */
    public triggerDataEmit(): void {
        /* Ok, so we've edited some data, let's tidy the raw data and remove
           unchanged areas. */
        let areaId;
        let levelId;
        let score;
        const emitData = {};

        /* First, lets loop over the raw areas. */
        for (areaId in this.rawComponentData) {
            /* Then check if each level is not 0, the default. */
            score = 0;

            for (levelId in this.rawComponentData[areaId]) {
                /* Convert to string. */
                this.rawComponentData[areaId][levelId] = this.rawComponentData[areaId][levelId].toString();

                /* If one of them is not 0, then add to score. */
                if (this.rawComponentData[areaId][levelId] !== '0') {
                    score += 1;
                }
            }

            /* Check if the area scored 0 and add it to the emitData if it did. */
            if (score > 0) {
                emitData[areaId] = this.rawComponentData[areaId];
            }
        }

        /* Lastly, emit the data. */
        this.updateEvent.emit(emitData);
    }

    /**
     * Option Select
     * -----------------
     * Takes a property name and permission level, and returns the value of the matched property in the optionsList
     *
     * @return string
     */
    optionSelect(property, level) {
        let value = 1;
        if (level) {
            value = Number(level);
        }

        return this.optionsList.find(el => el.id === value)[property];
    }

    /**
     * Set Open
     * -----------------
     * Sets a property using the areaIndex and levelIndex as an identifier on the optionOpen object which controls the
     * opening and closing of option list dropdowns
     *
     * @return {void}
     */
    setOpen(areaIndex, levelIndex) {
        const initial = this.optionOpen[String(areaIndex) + String(levelIndex)];
        this.optionOpen = {};
        this.optionOpen[String(areaIndex) + String(levelIndex)] = initial ? false : true;
    }

    /**
     * Check Open
     * -----------------
     * Checks if the optionOpen object contains a matched property and returns true if so, which opens the option list
     * dropdown
     *
     * @return boolean
     */
    checkOpen(areaIndex, levelIndex) {
        if (this.optionOpen[String(areaIndex) + String(levelIndex)]) {
            return true;
        }
    }

}
