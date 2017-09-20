import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'share',
    styleUrls: ['./fund.component.scss'],
    templateUrl: './share.component.html',
})
export class ShareComponent {
    @Input('group')

    public shareForm: FormGroup;
    public subLevel = 0;

    public navItems = ['Administratif', 'Services', 'Catégorie', 'Juridique', 'Frais', 'Risque', 'Profile', 'Caractéristiques', 'Calendrier', 'Documents'];

    changeSubLevel(level) {
        // of a specific part
        this.subLevel = level;
    }
}
