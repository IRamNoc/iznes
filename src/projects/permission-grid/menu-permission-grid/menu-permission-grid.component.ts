import {
    Component,
    Input,
    Output,
    OnInit,
    AfterViewInit,
    EventEmitter
} from '@angular/core';
import { cloneDeep } from 'lodash';

/* Import the option list. */
import { MenuOptionListComponent } from '../menu-option-list/menu-option-list.component';

@Component({
    selector: 'setl-menu-permission-grid',
    templateUrl: './menu-permission-grid.component.html',
    styleUrls: ['./menu-permission-grid.component.css']
})
export class MenuPermissionGridComponent implements OnInit, AfterViewInit {

    /* Permission areas, each row. */
    public permissionAreasCopy: Array<any> = [];

    @Input()
    set permissionAreas(permissionAreas: Array<any>) {
        this.permissionAreasCopy = cloneDeep(permissionAreas);
    }

    /* Permission level, each column. */
    @Input()
    public permissionLevels: Array<any> = [];

    /* Init Data, the data to show. */
    @Input()
    public initData: EventEmitter<any>;

    /* Update event, the output of the data. */
    @Output()
    public updateEvent: EventEmitter<any> = new EventEmitter();

    /* Raw Data Store. */
    private rawComponentData: any = {};
    private relationships = {};
    private indent = {
        0: '',
        1: '⎿____ ',
        2: '     ⎿____ ',
        3: '          ⎿____ ',
        4: '               ⎿____ '
    };
    private orderCount = 1;

    constructor() {
        /* Stub. */
    }

    ngOnInit() {
        // console.log(" |-- Init Permission Grid. ");
        // console.log(" | > permissionAreasCopy:", this.permissionAreasCopy);
        // console.log(" | > permissionLevels:", this.permissionLevels);
        // console.log(" | > initData:", this.initData);
        /* Create the new data structure, this will be the two way bound data to
           the grid. */

        let parentObj = {};
        let sortedList = [];
        let hiddenLinks = [];
        this.permissionAreasCopy.forEach((row) => {
            if (!(row['parentID'] in parentObj)) parentObj[row['parentID']] = [];
            parentObj[row['parentID']].push(row);
        });
        this.orderCount = 1;
        this.buildArr(parentObj, 0, 0, sortedList);
        this.buildArr(parentObj, -1, 0, hiddenLinks);

        this.permissionAreasCopy = sortedList.concat(hiddenLinks);

        Object.keys(parentObj).forEach((key) => {
            if (!(key in this.relationships)) this.relationships[key] = {};
            this.relationships[key]['children'] = parentObj[key];
            parentObj[key].forEach((key2) => {
                if (!(key2['id'] in this.relationships)) this.relationships[key2['id']] = {};
                this.relationships[key2['id']]['parent'] = key;
            });
        });

        let i, j;
        /* Firstly loop each area and make an object to represent it. */
        for (i = 0; i < this.permissionAreasCopy.length; i++) {
            /* This is set with a key of the area's ID. */
            this.rawComponentData[this.permissionAreasCopy[i].id] = {};

            /* Then lets loop over each permission level and set a key with
               their ID in this new area object. */
            for (j = 0; j < this.permissionLevels.length; j++) {
                /* Equal it to zero by default. */
                this.rawComponentData[this.permissionAreasCopy[i].id][this.permissionLevels[j].id] = "0";
            }
            /* Done! */
        }
        // console.log(' | < setup raw data: ', this.rawComponentData);

        /* Subscribe to the initData event. */
        // console.log(" | init data: ", this.initData);
        if (this.initData) {
            // console.log(" | init data emitter is set.");
            // console.log( "subscribe: ", new Date() );
            this.initData.subscribe((data) => {
                /* Check if we have data. */
                if (!data) {
                    console.warn("Permission Grid: Emitted data to initData, but it was undefined.");
                    return;
                }

                for (let i = 0; i < this.permissionAreasCopy.length; i++) {
                    if (!!data[this.permissionAreasCopy[i].id]) {
                        this.permissionAreasCopy[i].order = data[this.permissionAreasCopy[i].id].menuOrder;
                    } else {
                        this.permissionAreasCopy[i].order = -1;
                    }
                }

                //missing from database? chuck it on the end of the parentID. move the others if needed.
                this.permissionAreasCopy.filter(item => item.order == -1).forEach((row) => {
                    //get parentID, filter and find max order within that section.
                    let nextId = Math.max.apply(Math, this.permissionAreasCopy.filter(item => item.parentID == row.parentID).map(function (o) {
                        return o.order;
                    })) + 1;

                    //alter current menu order
                    for (let i = 0; i < this.permissionAreasCopy.length; i++) {
                        if (this.permissionAreasCopy[i].order >= nextId) this.permissionAreasCopy[i].order++;
                    }

                    //add new.
                    this.permissionAreasCopy[this.permissionAreasCopy.findIndex(item => item.id == row.id)].order = nextId;
                });

                this.permissionAreasCopy.sort((a, b) => {
                    return (a.order == 0 || b.order == 0 ? b.order - a.order : a.order - b.order);
                });

                /* Loop over the object and set this raw data to it, then emit data again. */
                // console.log(" | < got new init data: ", data);
                let i, j;
                /* Firstly loop each permission area. */
                for (i = 0; i < this.permissionAreasCopy.length; i++) {
                    /* Then each permission level. */
                    for (j = 0; j < this.permissionLevels.length; j++) {
                        /* Now let's check if the permission area is in the new data. */
                        if (data[this.permissionAreasCopy[i].id]) {
                            /* Now let's check if the permission level is in the permission area in the new data. */
                            if (data[this.permissionAreasCopy[i].id][this.permissionLevels[j].id]) {
                                /* Set the raw data and trigger event update. */
                                this.rawComponentData[this.permissionAreasCopy[i].id][this.permissionLevels[j].id] = data[this.permissionAreasCopy[i].id][this.permissionLevels[j].id];
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

    buildArr(parentObj, parentID, level, sortedList) {
        let order = 1;
        parentObj[parentID].forEach((row) => {
            row['level'] = level;
            row['order'] = this.orderCount++;
            sortedList.push(row);
            if (row['id'] in parentObj) this.buildArr(parentObj, row['id'], level + 1, sortedList);
        })
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

        if (this.permissionAreasCopy[this.permissionAreasCopy.findIndex(x => x.id == permissionId)].parentId > -1) {
            if (newValue == '1') {
                // if being added (two levels only)

                // check for parents. if not added then add.
                if (this.relationships[permissionId]['parent'] != 0) {
                    console.log('add parent');
                    this.rawComponentData[this.relationships[permissionId]['parent']][levelId] = newValue;
                }

                // check for children. add all if any.
                if (!!this.relationships[permissionId]['children']) {
                    console.log('add children');

                    this.relationships[permissionId]['children'].forEach((row) => {
                        this.rawComponentData[row['id']][levelId] = newValue;
                    });
                }
            } else {
                // if being removed (two levels only)

                // check for parents. all children removed? remove parent.
                if (this.relationships[permissionId]['parent'] != 0) {
                    let parentId = this.relationships[permissionId]['parent'];
                    if (!!this.relationships[parentId]['children']) {

                        let remove = 1;
                        this.relationships[parentId]['children'].forEach((row) => {
                            if (this.rawComponentData[row['id']][levelId] == 1) remove = 0;
                        });
                        if (remove == 1) {
                            console.log('no children left - remove parent');
                            this.rawComponentData[parentId][levelId] = newValue;
                        }
                    }
                }

                // check for children. if any then remove all.
                if (!!this.relationships[permissionId]['children']) {
                    console.log('no parent - remove children');

                    this.relationships[permissionId]['children'].forEach((row) => {
                        this.rawComponentData[row['id']][levelId] = newValue;
                    });
                }
            }
        }

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
        let areaId, levelId, score, emitData = {};

        /* First, lets loop over the raw areas. */
        for (areaId in this.rawComponentData) {
            // /* Then check if each level is not 0, the default. */
            // score = 0;
            //
            for (levelId in this.rawComponentData[areaId]) {
                /* Convert to string. */
                this.rawComponentData[areaId][levelId] = this.rawComponentData[areaId][levelId].toString();

                // /* If one of them is not 0, then add to score. */
                // if (this.rawComponentData[areaId][levelId] !== "0") {
                //     // console.log(" | > ", areaId+"-"+levelId+" as not 0");
                //     score += 1;
                // }
            }
            //
            // if (!!this.permissionAreasCopy[areaId] && this.permissionAreasCopy[areaId]['order'] != areaId) score += 1;
            //
            // /* Check if the area scored 0 and add it to the emitData if it did. */
            // if (score > 0) {
            //     emitData[areaId] = this.rawComponentData[areaId];
            // }

            emitData[areaId] = this.rawComponentData[areaId];
            emitData[areaId]['menuOrder'] = this.permissionAreasCopy[this.permissionAreasCopy.findIndex(x => x.id == areaId)].order;
        }

        // console.log(" | > data to emit: ", emitData);
        /* Lastly, emit the data. */
        this.updateEvent.emit(emitData);
    }

    public changeOrder(id, change) {
        let index = this.permissionAreasCopy.findIndex(x => x.id == id);
        let confirm = false;

        if (change == -1) {
            //is the next one lower? if not then ok.
            if (index != 0 && this.permissionAreasCopy[index].level <= this.permissionAreasCopy[index - 1].level && this.permissionAreasCopy[index - 1].parentID != -1) confirm = true;
        } else if (this.permissionAreasCopy.length > index + 1) {
            //if you can find the same level without going under the current level then ok.
            for (let i = index + 1; i < this.permissionAreasCopy.length; i++) {
                if (this.permissionAreasCopy[index].level > this.permissionAreasCopy[i].level) break;
                if (this.permissionAreasCopy[index].level == this.permissionAreasCopy[i].level && this.permissionAreasCopy[i].parentID != -1) {
                    confirm = true;
                    break;
                }
            }
        }

        if (confirm) {
            let testArr = [];
            if (change == -1) {     //up arrow
                console.log('moving up');
                //find the object being moved and store it.
                let temp = [];
                temp.push(this.permissionAreasCopy[index]);
                for (let i = index + 1; i < this.permissionAreasCopy.length; i++) {
                    //loop until same level or lower found
                    if (this.permissionAreasCopy[index].level >= this.permissionAreasCopy[i].level) break;
                    temp.push(this.permissionAreasCopy[i]);
                }

                //find the other object being moved and move it.
                let newIndex = 0;
                let total = 0;
                for (let i = index - 1; i >= 0; i--) {
                    //loop until same level
                    newIndex = i;
                    total++;

                    testArr.push(cloneDeep(this.permissionAreasCopy[i]));

                    this.permissionAreasCopy[i].order += temp.length;
                    this.permissionAreasCopy[i + temp.length] = this.permissionAreasCopy[i];

                    if (temp[0].level == this.permissionAreasCopy[i].level) break;
                }

                //put first object back.
                temp.forEach((row) => {
                    row.order -= total;
                    this.permissionAreasCopy[newIndex++] = row;
                });

            } else {                //down arrow
                console.log('moving down');
                //find the object being moved and store it.
                let temp = [];
                temp.push(this.permissionAreasCopy[index]);
                for (let i = index + 1; i < this.permissionAreasCopy.length; i++) {
                    //loop until same level or lower found
                    if (this.permissionAreasCopy[index].level >= this.permissionAreasCopy[i].level) break;
                    temp.push(this.permissionAreasCopy[i]);
                }

                //find the other object being moved and move it.
                let total = 1;
                this.permissionAreasCopy[index] = this.permissionAreasCopy[index + temp.length];
                this.permissionAreasCopy[index].order -= temp.length;
                testArr.push(cloneDeep(this.permissionAreasCopy[index]));

                if (this.permissionAreasCopy[index + temp.length + 1].level > this.permissionAreasCopy[index + temp.length].level) {
                    for (let i = index + temp.length + 1; i < this.permissionAreasCopy.length; i++) {
                        if (this.permissionAreasCopy[i].level <= this.permissionAreasCopy[index].level) break;
                        //loop until same level
                        total++;

                        testArr.push(cloneDeep(this.permissionAreasCopy[i]));

                        this.permissionAreasCopy[i].order -= temp.length;
                        this.permissionAreasCopy[i - temp.length] = this.permissionAreasCopy[i];
                    }
                }

                //put first object back.
                let newIndex = index + total;
                temp.forEach((row) => {
                    row.order += total;
                    this.permissionAreasCopy[newIndex++] = row;
                });
            }

            this.triggerDataEmit();
        }
    }
}
