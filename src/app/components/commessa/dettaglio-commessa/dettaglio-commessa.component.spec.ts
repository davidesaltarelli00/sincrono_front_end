import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioCommessaComponent } from './dettaglio-commessa.component';

describe('DettaglioCommessaComponent', () => {
  let component: DettaglioCommessaComponent;
  let fixture: ComponentFixture<DettaglioCommessaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DettaglioCommessaComponent]
    });
    fixture = TestBed.createComponent(DettaglioCommessaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
