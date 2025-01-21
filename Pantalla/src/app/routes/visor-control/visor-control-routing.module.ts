import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';




import { VisorControlEspFourComponent } from './esp-four/esp-four.component';


const routes: Routes = [
 
  { path: 'esp-four', component: VisorControlEspFourComponent }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisorControlRoutingModule { }
