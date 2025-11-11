import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PlaceholderComponent } from '../../shared/placeholder.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: PlaceholderComponent }])
  ]
})
export class DocumentsModule { }