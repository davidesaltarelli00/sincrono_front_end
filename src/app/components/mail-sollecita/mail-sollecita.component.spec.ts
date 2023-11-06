import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSollecitaComponent } from './mail-sollecita.component';

describe('MailSollecitaComponent', () => {
  let component: MailSollecitaComponent;
  let fixture: ComponentFixture<MailSollecitaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MailSollecitaComponent]
    });
    fixture = TestBed.createComponent(MailSollecitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
