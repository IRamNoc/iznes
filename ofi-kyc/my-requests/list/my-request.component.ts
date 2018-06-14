import {Component, OnInit} from '@angular/core';


interface Invitation{
    title : String
}

@Component({
    selector : 'my-request',
    templateUrl : './my-request.component.html'
})
export class MyRequestComponent implements OnInit{


    constructor(){}

    ngOnInit(){

    }

}