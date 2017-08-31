import {
    Component,
    Input,
    Output,
    OnInit,
    EventEmitter
} from '@angular/core';

@Component({
  selector: 'setl-permission-grid',
  templateUrl: './permission-grid.component.html',
  styleUrls: ['./permission-grid.component.scss']
})
export class PermissionGridComponent implements OnInit {

    /* Permission areas, each row. */
    @Input()
    public permissionAreas:Array<any> = [];

    /* Permission level, eahc column. */
    @Input()
    public permissionLevels:Array<any> = [];

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
