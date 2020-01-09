import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { BrowserModule } from '@angular/platform-browser';
import { DatagridListComponent } from './datagrid-list.component';
import { DatagridFieldComponent } from './datagrid-field.component';
import { DynamicFormsModule } from '@setl/utils/components/dynamic-forms';
import { FileViewerModule } from '@setl/core-fileviewer/fileviewer.module';
import { SetlDirectivesModule, SetlPipesModule } from '@setl/utils';

@NgModule({
    declarations: [
        DatagridListComponent,
        DatagridFieldComponent,
    ],
    exports: [
        DatagridListComponent,
        DatagridFieldComponent,
        FileViewerModule,
    ],
    imports: [
        BrowserModule,
        ClarityModule,
        DynamicFormsModule,
        FileViewerModule,
        SetlDirectivesModule,
        SetlPipesModule,
    ],
})

export class DatagridListModule {
}
