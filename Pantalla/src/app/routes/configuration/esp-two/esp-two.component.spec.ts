import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationEspTwoComponent } from './esp-two.component';

describe('ConfigurationEspTwoComponent', () => {
  let component: ConfigurationEspTwoComponent;
  let fixture: ComponentFixture<ConfigurationEspTwoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationEspTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationEspTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
