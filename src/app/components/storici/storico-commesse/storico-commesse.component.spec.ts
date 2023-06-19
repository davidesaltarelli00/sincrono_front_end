import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoricoCommesseComponent } from './storico-commesse.component';

describe('StoricoCommesseComponent', () => {
  let component: StoricoCommesseComponent;
  let fixture: ComponentFixture<StoricoCommesseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoricoCommesseComponent]
    });
    fixture = TestBed.createComponent(StoricoCommesseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
