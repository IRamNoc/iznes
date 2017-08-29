import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetlBalancesComponent} from './balances/balances.component';
import {SetlIssueComponent} from './issue/issue.component';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';

@Pipe({
    name: 'asset'
})
export class AssetPipe implements PipeTransform {
    transform(value: string, args: string[]): string {
        value = value.replace('|', '<span class="asset-pipe">|</span>');
        return value;
    }
}

@NgModule({
    imports: [
        CommonModule,
        ClarityModule
    ],
    declarations: [
        SetlBalancesComponent,
        SetlIssueComponent,
        AssetPipe
    ],
    exports: [
        SetlBalancesComponent,
        SetlIssueComponent
    ]
})
export class SetlBalancesModule {
}
