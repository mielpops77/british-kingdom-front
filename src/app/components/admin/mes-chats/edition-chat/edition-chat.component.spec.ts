import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionChatComponent } from './edition-chat.component';

describe('EditionChatComponent', () => {
  let component: EditionChatComponent;
  let fixture: ComponentFixture<EditionChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
