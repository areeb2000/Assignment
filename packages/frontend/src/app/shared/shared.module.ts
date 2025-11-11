import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { PlaceholderComponent } from './placeholder.component';

@NgModule({
  declarations: [
    PlaceholderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    MaterialModule,
    PlaceholderComponent
  ]
})
export class SharedModule { }