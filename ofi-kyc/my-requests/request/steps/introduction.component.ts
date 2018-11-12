import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'kyc-step-introduction',
    templateUrl: './introduction.component.html',
    styleUrls: ['./introduction.component.scss']
})
export class NewKycIntroductionComponent implements OnInit{
    constructor(){}
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();


    ngOnInit() {
    }
    handleSubmit(){
        this.submitEvent.emit({
            completed : true
        });
    }
}