import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FripouilleComponent } from './fripouille.component';

describe('FripouilleComponent', () => {
  let component: FripouilleComponent;
  let fixture: ComponentFixture<FripouilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FripouilleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FripouilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
