import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationEspOneComponent } from './esp-one.component';

describe('ConfigurationEspOneComponent', () => {
  let component: ConfigurationEspOneComponent;
  let fixture: ComponentFixture<ConfigurationEspOneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationEspOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationEspOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
