import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorControlEspFourComponent } from './esp-four.component';

describe('VisorControlEspFourComponent', () => {
  let component: VisorControlEspFourComponent;
  let fixture: ComponentFixture<VisorControlEspFourComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VisorControlEspFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorControlEspFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
