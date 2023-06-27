import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalesComponent } from './males.component';

describe('MalesComponent', () => {
  let component: MalesComponent;
  let fixture: ComponentFixture<MalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
