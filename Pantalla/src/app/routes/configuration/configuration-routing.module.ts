import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationEspOneComponent } from './esp-one/esp-one.component';
import { ConfigurationEspTwoComponent } from './esp-two/esp-two.component';

const routes: Routes = [
  { path: 'esp-one', component: ConfigurationEspOneComponent },
  { path: 'esp-two', component: ConfigurationEspTwoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
