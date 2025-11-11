import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationFormComponent } from './application-form/application-form.component';

@NgModule({
  declarations: [
    ApplicationListComponent,
    ApplicationFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    RouterModule.forChild([
      { path: '', component: ApplicationListComponent },
      { path: 'new', component: ApplicationFormComponent },
      { path: 'edit/:id', component: ApplicationFormComponent }
    ])
  ]
})
export class ApplicationsModule { }