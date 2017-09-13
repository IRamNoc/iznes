import {
    Component,
    Input,
    Output,
    OnInit,
    AfterViewInit,
    EventEmitter
} from '@angular/core';

/* Import the option list. */
import { OptionListComponent } from '../option-list/option-list.component'

@Component({
  selector: 'setl-permission-grid',
  templateUrl: './permission-grid.component.html',
  styleUrls: ['./permission-grid.component.css']
})
export class PermissionGridComponent implements OnInit, AfterViewInit {

    /* Permission areas, each row. */
    @Input()
    public permissionAreas:Array<any> = [];

    /* Permission level, each column. */
    @Input()
    public permissionLevels:Array<any> = [];

    /* Init Data, the data to show. */
    @Input()
    public initData:EventEmitter<any>;

    /* Update event, the output of the data. */
    @Output()
    public updateEvent:EventEmitter<any> = new EventEmitter();

    /* Raw Data Store. */
    private rawComponentData:any = {};

    constructor () {
        /* Stub. */
    }

    ngOnInit () {
        // console.log(" |-- Init Permission Grid. ");
        // console.log(" | > permissionAreas:", this.permissionAreas);
        // console.log(" | > permissionLevels:", this.permissionLevels);
        // console.log(" | > initData:", this.initData);
        /* Create the new data structure, this will be the two way bound data to
           the grid. */
        let i, j;
        /* Firstly loop each area and make an object to represent it. */
        for ( i = 0; i < this.permissionAreas.length; i++ ) {
            /* This is set with a key of the area's ID. */
            this.rawComponentData[this.permissionAreas[i].id] = {};

            /* Then lets loop over each permission level and set a key with
               their ID in this new area object. */
            for ( j = 0; j < this.permissionLevels.length; j++ ) {
                /* Equal it to zero by default. */
                this.rawComponentData[this.permissionAreas[i].id][this.permissionLevels[j].id] = "0";
            }
            /* Done! */
        }
        // console.log(' | < setup raw data: ', this.rawComponentData);

        /* Subscribe to the initData event. */
        // console.log(" | init data: ", this.initData);
        if ( this.initData ) {
            // console.log(" | init data emitter is set.");
            // console.log( "subscribe: ", new Date() );
            this.initData.subscribe((data) => {
                /* Check if we have data. */
                if ( ! data ) {
                    console.warn("Permission Grid: Emitted data to initData, but it was undefined.");
                    return;
                }

                /* Loop over the object and set this raw data to it, then emit data again. */
                // console.log(" | < got new init data: ", data);
                let i, j;
                /* Firstly loop each permission area. */
                for ( i = 0; i < this.permissionAreas.length; i++ ) {
                    /* Then each permission level. */
                    for ( j = 0; j < this.permissionLevels.length; j++ ) {
                        /* Now let's check if the permission area is in the new data. */
                        if ( data[this.permissionAreas[i].id] ) {
                            /* Now let's check if the permission level is in the permission area in the new data. */
                            if (  data[this.permissionAreas[i].id][this.permissionLevels[j].id] ) {
                                /* Set the raw data and trigger event update. */
                                this.rawComponentData[this.permissionAreas[i].id][this.permissionLevels[j].id] = data[this.permissionAreas[i].id][this.permissionLevels[j].id];
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

    ngAfterViewInit () {

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
    public updateValue (permissionId, levelId, newValue) {
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
    public triggerDataEmit ():void {
        /* Ok, so we've edited some data, let's tidy the raw data and remove
           unchanged areas. */
        let areaId, levelId, score, emitData = {};

        /* First, lets loop over the raw areas. */
        for ( areaId in this.rawComponentData ) {
            /* Then check if each level is not 0, the default. */
            score = 0;

            for ( levelId in this.rawComponentData[areaId] ) {
                /* Convert to string. */
                this.rawComponentData[areaId][levelId] = this.rawComponentData[areaId][levelId].toString();

                /* If one of them is not 0, then add to score. */
                if ( this.rawComponentData[areaId][levelId] !== "0" ) {
                    // console.log(" | > ", areaId+"-"+levelId+" as not 0");
                    score += 1;
                }
            }

            /* Check if the area scored 0 and add it to the emitData if it did. */
            if ( score > 0 ) {
                emitData[areaId] = this.rawComponentData[areaId];
            }
        }

        // console.log(" | > data to emit: ", emitData);
        /* Lastly, emit the data. */
        this.updateEvent.emit( emitData );
    }

}
