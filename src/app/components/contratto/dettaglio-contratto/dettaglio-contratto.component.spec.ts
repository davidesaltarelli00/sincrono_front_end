import { ComponentFixture,TestBed} from '@angular/core/testing';
import { DettaglioContrattoComponent } from './dettaglio-contratto.component';

describe('DettaglioContrattoComponent', () => {
  let component: DettaglioContrattoComponent;
  let fixture: ComponentFixture<DettaglioContrattoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DettaglioContrattoComponent]
    });
    fixture = TestBed.createComponent(DettaglioContrattoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
