import { TestBed } from '@angular/core/testing';
import { ContrattoService } from './contratto-service';
import { DettaglioContrattoComponent } from './dettaglio-contratto/dettaglio-contratto.component';

describe('ContrattoService', () => {
  let service: ContrattoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [ DettaglioContrattoComponent ]
      })
      .compileComponents();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});