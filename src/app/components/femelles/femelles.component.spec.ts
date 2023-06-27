import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FemellesComponent } from './femelles.component';

describe('FemellesComponent', () => {
  let component: FemellesComponent;
  let fixture: ComponentFixture<FemellesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FemellesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FemellesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
