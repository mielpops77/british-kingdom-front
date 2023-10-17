import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreDorComponent } from './livre-dor.component';

describe('LivreDorComponent', () => {
  let component: LivreDorComponent;
  let fixture: ComponentFixture<LivreDorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivreDorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivreDorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
