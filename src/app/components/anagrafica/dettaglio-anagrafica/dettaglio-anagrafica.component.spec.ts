import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioAnagraficaComponent } from './dettaglio-anagrafica.component';

describe('DettaglioAnagraficaComponent', () => {
  let component: DettaglioAnagraficaComponent;
  let fixture: ComponentFixture<DettaglioAnagraficaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DettaglioAnagraficaComponent]
    });
    fixture = TestBed.createComponent(DettaglioAnagraficaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
