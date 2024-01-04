import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorteeComponent } from './portee.component';

describe('PorteeComponent', () => {
  let component: PorteeComponent;
  let fixture: ComponentFixture<PorteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PorteeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PorteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
