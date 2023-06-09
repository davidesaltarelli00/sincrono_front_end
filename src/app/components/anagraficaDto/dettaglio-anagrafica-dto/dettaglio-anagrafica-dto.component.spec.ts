import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioAnagraficaDtoComponent } from './dettaglio-anagrafica-dto.component';

describe('DettaglioAnagraficaDtoComponent', () => {
  let component: DettaglioAnagraficaDtoComponent;
  let fixture: ComponentFixture<DettaglioAnagraficaDtoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DettaglioAnagraficaDtoComponent]
    });
    fixture = TestBed.createComponent(DettaglioAnagraficaDtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
