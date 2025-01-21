import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { NgApexchartsModule } from "ng-apexcharts";

import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';

import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';

import { VisorControlRoutingModule } from './visor-control-routing.module';

import { VisorControlEspFourComponent } from './esp-four/esp-four.component';
import { MatNativeDateModule } from '@angular/material/core';


const COMPONENTS = [

  VisorControlEspFourComponent
];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    VisorControlRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'Este campo es obligatorio' },
      ],
    }),
    FormlyMatToggleModule,
    MatNativeDateModule,
    FormlyMatDatepickerModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ],
  entryComponents: COMPONENTS_DYNAMIC
})
export class VisorControlModule { }
