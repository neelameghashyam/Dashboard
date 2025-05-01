// .storybook/preview.ts
import { setCompodocJson } from '@storybook/addon-docs/angular';
import { moduleMetadata, applicationConfig } from '@storybook/angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';
import docJson from '../documentation.json'; // Optional: If using Compodoc

setCompodocJson(docJson);

export const decorators = [
  applicationConfig({
    providers: [
      importProvidersFrom(
        MatIconModule,
        MatNativeDateModule
      ),
    ],
  }),
  moduleMetadata({
    imports: [
      CommonModule,
      BrowserAnimationsModule,
      MatIconModule,
      MatButtonModule,
      MatMenuModule,
      MatToolbarModule,
      MatSidenavModule,
      MatListModule,
      MatTooltipModule,
      MatDividerModule,
      MatStepperModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatDatepickerModule,
      MatCheckboxModule,
      MatCardModule,
      MatDialogModule,
      MatTableModule,
      MatPaginatorModule,
      ReactiveFormsModule,
      FormsModule,
    ],
  }),
];