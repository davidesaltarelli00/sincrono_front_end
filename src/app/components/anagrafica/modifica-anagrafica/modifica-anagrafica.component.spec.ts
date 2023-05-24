import { ModificaAnagraficaComponent } from './modifica-anagrafica.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ModificaAnagraficaComponent', () => {
  let component: ModificaAnagraficaComponent;
  let fixture: ComponentFixture<ModificaAnagraficaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaAnagraficaComponent]
    });
    fixture = TestBed.createComponent(ModificaAnagraficaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
