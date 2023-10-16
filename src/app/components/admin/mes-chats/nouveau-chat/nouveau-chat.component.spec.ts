import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauChatComponent } from './nouveau-chat.component';

describe('NouveauChatComponent', () => {
  let component: NouveauChatComponent;
  let fixture: ComponentFixture<NouveauChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouveauChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouveauChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
