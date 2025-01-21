import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationEspOneComponent } from './esp-one/esp-one.component';
import { ConfigurationEspTwoComponent } from './esp-two/esp-two.component';

const COMPONENTS = [ConfigurationEspOneComponent, ConfigurationEspTwoComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [
    SharedModule,
    ConfigurationRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ],
  entryComponents: COMPONENTS_DYNAMIC
})
export class ConfigurationModule { }
