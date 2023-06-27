import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatonsComponent } from './chatons.component';

describe('ChatonsComponent', () => {
  let component: ChatonsComponent;
  let fixture: ComponentFixture<ChatonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
