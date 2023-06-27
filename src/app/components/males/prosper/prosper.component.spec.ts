import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsperComponent } from './prosper.component';

describe('ProsperComponent', () => {
  let component: ProsperComponent;
  let fixture: ComponentFixture<ProsperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProsperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProsperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
