import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodpressureComponent } from './bloodpressure.component';

describe('BloodpressureComponent', () => {
  let component: BloodpressureComponent;
  let fixture: ComponentFixture<BloodpressureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BloodpressureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodpressureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
